export default function () {
    const { toast } = useMisc();
    const { myId, appHost, client } = useAuth();
    const isLoading = ref<boolean>(true);
    const popDelete = ref<any | null>(null);
    const popRsvp = ref<any | null>(null);
    const rsvpModal = ref<boolean>(false);
    const createInviteAPI = ref<boolean>(false);
    const userSearch = ref('');

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
        partySize: '',
        coverCharge: '',
        info: '',
        eventPic: '',
        location: [],
        categories: [],
        eventInvites: [],
        userInvites: [],
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

            eventData.hostId = await initiatorId;
            eventData.hostUser = await initiatorUser;
            eventData.hostName = await hostName;

            eventData.title = await title;
            eventData.startDate = await startDate;
            eventData.partySize = await partySize;
            eventData.coverCharge = await coverCharge;
            eventData.info = await info;
            eventData.eventPic = await eventPic;
            eventData.location = await location;
            eventData.eventInvites = await invites;
            eventData.receipts.value = await eventReceipt;

            eventData.hostAvatar = await eventRes.data.attributes.initiator.data.attributes.avatar?.data?.attributes?.url;

            const [hostFirstName, ...rest] = hostName.split(/\s+/);
            const hostLastName = rest.join(' ');
            eventData.hostFirstName = hostFirstName;
            eventData.hostLastName = hostLastName;
            const hostInitials = hostName.split(/\s+/).map((name: string) => name[0].toUpperCase()).join('');
            eventData.hostInitials = hostInitials;
            eventData.hostUrl = `/${initiatorUser}`;

            eventData.categories.push(eventData.location[0]?.category.split(', '));

            // Calculate remaining open spots
            // Push all invited usernames from eventInvites to userInvites array
            let going = 0;
            eventData.eventInvites.forEach(async (invite: Record<string, any>) => {
                if (invite.attributes.eventStatus === 'going') {
                    going++;
                }
                const invitedUser = invite.attributes.users_permissions_user.data.attributes.username;
                (eventData.userInvites).push({ 'username': invitedUser });
            });
            eventData.spots = eventData.partySize - going;
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
                console.log('delEventPicRes', await delEventPicRes);
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
                    console.log('delInviteResult', delInviteResult);
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
                console.log('delEventResult', delEventResult);
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

    async function createInvites(eventObj: Record<string, any>) {
        try {
            createInviteAPI.value = true;
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
                    console.log('inviteData', inviteData);
                } catch (error) {
                    console.error(error);
                } finally {
                    toast.info(`${inviteUser.username} invited!`, { timeout: 1200 });
                    removeInvite(inviteUser);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            createInviteAPI.value = false;
        }
    }

    async function inviteUser() {
        try {
            const username = userSearch.value.trim();
            // Check if user has already been added to userInvites array
            // Note: invitation for initiator (host) will already be created on event creation
            if (eventData.userInvites.some((user: any) => user.username === username)) {
                toast.error('User is already invited!', { timeout: 1700 });
                userSearch.value = '';
                return;
            } else if (eventData.userInvites.some((user: any) => user.username === username)) {
                toast.error('User is already on invite list!', { timeout: 1700 });
                userSearch.value = '';
                return;
            }
            // Check if username exists in database
            const userRes: Record<string, any> = await client(`${appHost}api/users?filters[username][$eq]=${username}`, {
                method: 'GET'
            });
            console.log('userRes', userRes);
            const inputUser = userRes[0];
            if (userRes && inputUser) {
                try {
                    // eventData.userInvites.push({ 'username': inputUser.username });
                    eventData.newInvites.push(inputUser);
                    userSearch.value = '';
                } catch (error) {
                    console.error(error);
                }
            } else {
                toast.error('User not found!', { timeout: 1700 });
                userSearch.value = '';
            }
        } catch (error) {
            console.error(error);
        } finally {
            console.log('newInvites', eventData.newInvites);
        }
    }

    function removeInvite(index: any) {
        eventData.newInvites.splice(index, 1);
    }

    return { isLoading, createInviteAPI, popDelete, popRsvp, openRsvp, closeRsvp, rsvpModal, userRsvp, inviteId, eventObj, rsvpEvent, getInvite, eventData, getEvent, deleteEvent, openDelete, closeDelete, createInvites, inviteUser, removeInvite, userSearch };
}
