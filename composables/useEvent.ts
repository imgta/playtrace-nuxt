export default function () {
    const { toast } = useMisc();
    const { myId, appHost, client, myUsername } = useAuth();
    const isLoading = ref<boolean>(true);
    const popDelete = ref<any | null>(null);
    const popRsvp = ref<any | null>(null);
    const rsvpModal = ref<boolean>(false);
    const createInviteAPI = ref<boolean>(false);
    const userSearch = ref('');
    const matchingUsers = ref<string[]>([]);

    const eventData = reactive({
        hostId: '',
        hostUser: '',
        hostAvatar: '',
        hostName: '',
        hostFirstName: '',
        hostLastName: '',
        hostInitials: '',
        hostUrl: '',
        title: '',
        startDate: '',
        partySize: 0,
        coverCharge: '',
        info: '',
        eventPic: '',
        location: [],
        categories: [],
        eventInvites: [],
        invitedUsers: [],
        newInvites: [],
        receipts: [],
        spots: '',
    }) as any;

    const invData = reactive({
        id: '',
        rsvp: '',
        eventObj: null,
    }) as any;

    const userRsvp = ref();
    const inviteId = ref();
    const eventObj = ref();

    function openDelete() {
        popDelete.value.showModal();
    }
    function closeDelete() {
        popDelete.value.close();
    }
    function openRsvp() {
        popRsvp.value.showModal();
        rsvpModal.value = true;
    }
    function closeRsvp() {
        popRsvp.value.close();
        rsvpModal.value = false;
    }

    async function getEvent(eventId: number) {
        const isLoading = ref<boolean>(true);
        try {
            const eventRes: Record<string, any> = await client(`${appHost}api/events/${eventId}?populate[0]=initiator.avatar&populate[1]=initiator.wallets&populate[2]=eventPic&populate[3]=location&populate[4]=eventReceipt.receiptItem&populate[5]=invited_users.users_permissions_user`, {
                method: 'GET'
            });
            const {
                title, startDate, partySize, coverCharge, info, location, eventReceipt,
                eventPic: { data: { attributes: { url: eventPic } } },
                initiator: { data: { id: initiatorId, attributes: { username: initiatorUser, fullName: hostName } } },
                invited_users: { data: invites },
            } = await eventRes.data.attributes;

            eventData.hostId = initiatorId;
            eventData.hostUser = initiatorUser;
            eventData.hostName = hostName;

            eventData.title = title;
            eventData.startDate = startDate;
            eventData.partySize = partySize;
            eventData.coverCharge = coverCharge;
            eventData.info = info;
            eventData.eventPic = eventPic;
            eventData.location = location;
            eventData.eventInvites = invites;
            eventData.receipts.value = eventReceipt;

            eventData.hostAvatar = await eventRes.data.attributes.initiator.data.attributes.avatar?.data?.attributes?.url;

            const [hostFirstName, ...rest] = hostName.split(/\s+/);
            const hostLastName = rest.join(' ');
            eventData.hostFirstName = hostFirstName;
            eventData.hostLastName = hostLastName;
            const hostInitials = hostName.split(/\s+/).map((name: string) => name[0].toUpperCase()).join('');
            eventData.hostInitials = hostInitials;
            eventData.hostUrl = `/${initiatorUser}`;

            // Calculate remaining open spots
            let going = 0;
            eventData.eventInvites.forEach(async (invite: Record<string, any>) => {
                if (invite.attributes.eventStatus === 'going') {
                    going++;
                }
                // Push all invited usernames from eventInvites to invitedUsers array
                const invitedUser = invite.attributes.users_permissions_user.data.attributes.username;
                (eventData.invitedUsers).push({ 'username': invitedUser });
            });
            eventData.spots = eventData.partySize - going;

            eventData.categories?.push(eventData.location[0]?.category?.split(', '));
        } catch (error) {
            console.error(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function rsvpEvent(eventId: number, inviteId: number, rsvp: string) {
        const rsvpForm = new FormData();
        const rsvpObj = {
            eventStatus: `${rsvp}`
        };
        rsvpForm.append('data', JSON.stringify(rsvpObj));
        try {
            const rsvpRes: Record<string, any> = await client(`${appHost}api/invited-users/${inviteId}`, {
                method: 'PUT',
                body: rsvpForm,
            });
            const rsvpData = await rsvpRes.data;
            closeRsvp();
        } catch (error) {
            console.error(error);
        } finally {
            if (rsvp === 'going') {
                toast.info('RSVP: Going!', { timeout: 1500 });
            } else if (rsvp === 'maybe') {
                toast.warning('RSVP: Maybe?', { timeout: 1500 });
            } else if (rsvp === 'noGo') {
                toast.error('RSVP: Not going.', { timeout: 1500 });
            }
            await getInvite(eventId, myId);
        }
    };

    async function getInvite(eventId: number, myId: number) {
        isLoading.value = true;
        try {
            const inviteRes: Record<string, any> = await client(`${appHost}api/invited-users?populate=*&filters[$and][0][collection][$eq]=event&filters[$and][1][users_permissions_user][id][$eq]=${myId}&filters[$and][2][event][id][$eq]=${eventId}`);
            const {
                id,
                attributes: { eventStatus },
                attributes: { event },
            } = await inviteRes.data[0];

            inviteId.value = id;
            userRsvp.value = eventStatus;
            eventObj.value = event.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteEvent(eventId: number) {
        try {
            closeDelete();
            // (1) Fetch and isolate target event data for cascade deletion
            const delEventRes: Record<string, any> = await client(`${appHost}api/events?populate=deep,3&filters[id][$eq]=${eventId}`, {
                method: 'GET'
            });
            const {
                id: delEventId,
                attributes: { eventPic: { data: { id: delEventPicId } } },
            } = await delEventRes.data[0];
            const delInviteIds = delEventRes.data[0].attributes.invited_users.data.map((invite: any) => invite.id);

            // (2a) Delete upload media file for eventPic (Strapi + AWS S3)
            try {
                const delEventPicRes: any = await client(`${appHost}api/upload/files/${delEventPicId}`, {
                    method: 'DELETE',
                });
            } catch (error) {
                console.error(error);
            } finally {
                toast.info('Event picture deleted!', { timeout: 1500 });
            }

            // (2b) Delete each invitedUser relational instance for target event
            try {
                const delInviteRequests = delInviteIds.map(async (id: number) => {
                    const delInvitesRes: any = await client(`${appHost}api/invited-users/${id}`, {
                        method: 'DELETE',
                    });
                    const delInviteResult = await delInvitesRes.data;
                });
                await Promise.all(delInviteRequests);
            } catch (error) {
                console.error(error);
            } finally {
                toast.info('All event invites deleted!', { timeout: 1500 });
            }

            // (2c) Finally, delete target event
            try {
                const delEventRes: any = await client(`${appHost}api/events/${delEventId}`, {
                    method: 'DELETE',
                });
                const delEventResult = await delEventRes.data;
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            toast.info('Event deleted!', { timeout: 1500 });
            getInvite(eventId, myId);
            await navigateTo('/events');
        }
    }

    async function usernameSearch() {
        if (userSearch.value.length > 2) {
            const inviteUsername = userSearch.value;
            try {
                const searchRes: Record<string, any> = await client(`${appHost}api/users?filters[username][$startsWithi]=${inviteUsername}`, {
                    method: 'GET'
                });
                const searchUsers = searchRes
                    .map((user: Record<string, any>) => user.username)
                    // Filter out users in invitedUsers (already invited) or newInvites (queued for invite)
                    .filter((username: string) => ![...eventData.newInvites, ...eventData.invitedUsers].some((inviteUser: Record<string, any>) => inviteUser.username === username || myUsername === username));
                matchingUsers.value = searchUsers;
            } catch (error) {
                console.error(error);
            }
        } else {
            matchingUsers.value = [];
        }
    }

    function selectInviteUser(username: string) {
        try {
            const inviteQuery = userSearch.value;
            userSearch.value = username;
            inviteUser();

            // Remove selected user from matchingUsers.value array
            matchingUsers.value = matchingUsers.value.filter((user: string) => user !== username);
            userSearch.value = inviteQuery;
        } catch (error) {
            console.error(error);
        }
    }

    function removeInvite(index: any) {
        // Re-search to update matchingUsers array
        usernameSearch();

        // Remove uninvited user from newInvites (invite queue)
        eventData.newInvites.splice(index, 1);
    }

    async function inviteUser() {
        try {
            const username = userSearch.value.trim();
            // Check if user is in newInvites array (already invited)
            // Note: invitation for initiator (host) will be created on event creation
            if (eventData.invitedUsers.some((user: any) => user.username === username)) {
                toast.error('User is already invited!', { timeout: 1700 });
                userSearch.value = '';
                return;
            }
            // Check if username exists in database
            const userRes: Record<string, any> = await client(`${appHost}api/users?filters[username][$eq]=${username}`, {
                method: 'GET'
            });

            const inputUser = userRes[0];
            if (userRes && inputUser) {
                try {
                    eventData.newInvites.push(inputUser);
                } catch (error) {
                    console.error(error);
                }
            } else {
                toast.error('User not found!', { timeout: 1700 });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function createInvites(eventObj: Record<string, any>) {
        for (const inviteUser of eventData.newInvites) {
            const inviteForm = new FormData();
            const inviteObj = {
                users_permissions_user: inviteUser,
                collection: 'event',
                event: eventObj,
                eventStatus: 'invited',
            };
            inviteForm.append('data', JSON.stringify(inviteObj));

            try {
                createInviteAPI.value = true;
                const inviteRes: Record<string, any> = await client(`${appHost}api/invited-users`, {
                    method: 'POST',
                    body: inviteForm,
                });
                const inviteData = await inviteRes.data;

                // Update invitedUsers array to include newly invited users
                eventData.invitedUsers.push({ 'username': inviteUser.username });
            } catch (error) {
                console.error(error);
            } finally {
                // Reset user invite search and matchingUsers array
                userSearch.value = '';
                matchingUsers.value = [];

                createInviteAPI.value = false;
                toast.info(`${inviteUser.username} invited!`, { timeout: 1200 });
            }
        }

        // Remove users that were just invited from eventData.newInvites array
        eventData.newInvites = eventData.newInvites.filter((inviteUser: Record<string, any>) => !eventData.invitedUsers.some((user: Record<string, any>) => user.username === inviteUser.username));
    }

    return { myUsername, isLoading, createInviteAPI, popDelete, popRsvp, openRsvp, closeRsvp, rsvpModal, userRsvp, inviteId, eventObj, rsvpEvent, getInvite, eventData, getEvent, deleteEvent, openDelete, closeDelete, createInvites, inviteUser, removeInvite, userSearch, usernameSearch, selectInviteUser, matchingUsers };
}
