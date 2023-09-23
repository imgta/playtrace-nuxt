export default function () {
    const { appHost, client, myId } = useAuth();
    const { isLoading } = useEvent();

    const eventTab = ref<string>('all');
    const inviteCount = ref<number>();
    const myEvents: Record<string, any> = ref([]);

    function pastEventCheck(startDate: string) {
        const currentTime = new Date();
        const eventStart = new Date(startDate);
        return eventStart <= currentTime;
    }
    function eventDisplay(event: any) {
        return eventTab.value === 'isHost'
            ? (myId === event.hostId && !pastEventCheck(event.startDate))
            : (eventTab.value === 'isInvited')
                ? (myId !== event.hostId && !pastEventCheck(event.startDate))
                : (eventTab.value === 'inPast')
                    ? (pastEventCheck(event.startDate))
                    : !(pastEventCheck(event.startDate));
    }

    async function getMyEvents(userId: number) {
        isLoading.value = true;
        try {
            const myEventsRes: Record<string, any> = await client(`${appHost}api/events?populate[0]=initiator.avatar&populate[1]=initiator.wallets&populate[2]=eventPic.url&populate[3]=invited_users.users_permissions_user&populate[4]=eventReceipt.receiptItem&populate[5]=location.zipcode&filters[invited_users][users_permissions_user][id][$in][0]=${userId}&sort=startDate`, {
                method: 'GET'
            });

            myEvents.value = await myEventsRes.data;

            inviteCount.value = myEvents.value.filter((event: Record<string, any>) => {
                return (event.attributes.initiator.data.id !== userId) && !pastEventCheck(event.attributes.startDate);
            }).length;
        } catch (error) {
            console.error(error);
        }
    }

    function mapEventsDestruct(userId: number) {
        try {
            return myEvents.value.map((event: any) => {
                const {
                    id: eventId,
                    attributes: {
                        title, partySize, startDate,
                        initiator: {
                            data: {
                                id: hostId,
                                attributes: {
                                    username: host,
                                    fullName: hostName,
                                }
                            }
                        },
                        eventPic: { data: { attributes: { url: coverUrl } } },
                        invited_users: { data: invites },
                        location: [{ zipcode }],
                    }
                } = event;
                const hostAvatar = event.attributes.initiator.data.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url;
                // Event host details
                const [hostFirstName, ...rest] = hostName.split(/\s+/);
                const hostLastName = rest.join(' ');
                const hostInitials = hostName.split(/\s+/).map((name: string) => name[0].toUpperCase()).join('');
                // Find RSVPs to event
                const inviteUserId = invites.find((invite: Record<string, any>) => invite.attributes.users_permissions_user.data.id === userId);
                const eventStatus = inviteUserId?.attributes.eventStatus;
                // Event headcount (RSVP === 'going')
                const goingCount = invites.filter((invite: Record<string, any>) => {
                    return invite.attributes.eventStatus === 'going';
                }).length;
                const hostUrl = `/${host}`;

                return { eventId, eventStatus, title, host, hostName, hostFirstName, hostLastName, hostInitials, hostId, hostAvatar, hostUrl, startDate, coverUrl, partySize, goingCount, zipcode };
            });
        } catch (error) {
            console.error(error);
        } finally {
            isLoading.value = false;
        }
    }

    return { myId, isLoading, eventTab, inviteCount, myEvents, eventDisplay, pastEventCheck, getMyEvents, mapEventsDestruct };
}
