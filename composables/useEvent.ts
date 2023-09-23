export default function () {
    const { appHost, client } = useAuth();
    const isLoading = ref<boolean>(true);

    const eventData = reactive({
        creatorId: '',
        creatorUser: '',
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

    async function getEvent(eventId: number) {
        const isLoading = ref<boolean>(true);
        try {
            const eventRes: Record<string, any> = await client(`${appHost}api/events/${eventId}?populate[0]=initiator.avatar&populate[1]=initiator.wallets&populate[2]=eventPic&populate[3]=location&populate[4]=eventReceipt.receiptItem&populate[5]=invited_users.users_permissions_user`, {
                method: 'GET'
            });
            const {
                title, startDate, partySize, coverCharge, info, location, eventReceipt,
                eventPic: { data: { attributes: { url: eventPic } } },
                initiator: { data: { id: initiatorId } },
                initiator: { data: { attributes: { username: initiatorUser } } },
                invited_users: { data: invites },
            } = await eventRes.data.attributes;

            eventData.creatorId = await initiatorId;
            eventData.creatorUser = await initiatorUser;
            eventData.title = await title;
            eventData.startDate = await startDate;
            eventData.partySize = await partySize;
            eventData.coverCharge = await coverCharge;
            eventData.info = await info;
            eventData.eventPic = await eventPic;
            eventData.location = await location;
            eventData.eventInvites = await invites;
            eventData.receipts.value = await eventReceipt;

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

    const invData = reactive({
        id: '',
        rsvp: '',
        eventObj: null,
    }) as any;

    async function getInvite(eventId: number, myId: number) {
        isLoading.value = true;
        try {
            const inviteRes: Record<string, any> = await client(`${appHost}api/invited-users?populate=*&filters[$and][0][collection][$eq]=event&filters[$and][1][users_permissions_user][id][$eq]=${myId}&filters[$and][2][event][id][$eq]=${eventId}`);
            const {
                id,
                attributes: { eventStatus },
                attributes: { event },
            } = await inviteRes.data[0];

            invData.id = id;
            invData.rsvp = eventStatus;
            invData.eventObj = event.data;
        } catch (error) {
            console.error(error);
        } finally {
            isLoading.value = false;
        }
    }

    return { isLoading, eventData, getEvent };
}
