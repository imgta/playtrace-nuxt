<script setup lang="ts">
const { toast } = useMisc();
const start = ref();
const nearbyData: any = ref([]);
const textSearchData: any = ref([]);

const traceStep = ref<number>(0);

const startAddress = ref('85 Seaport Blvd');
const textQuery = ref<string>('');
const queryPool = ref<string[]>([]);
const queryCount = ref<number>(0);
const circuit: any = ref([]);
const idPool = ref<string[]>([]);

const aType = [''];

// ----------------------------------------------------------------
watchEffect(() => {
    console.log('circuit.value', circuit.value);
    console.log('queryPool.value.length', queryPool.value.length);
    console.log('queryCount.value', queryCount.value);
    console.log('traceStep.value', traceStep.value);
});
// ----------------------------------------------------------------
function getLatLong(data: Record<string, any>) {
    const { Ua: lat, Ia: long } = data.geometry?.viewport;
    const avgLat = (lat.lo + lat.hi) / 2;
    const avgLng = (long.lo + long.hi) / 2;
    return { lat: avgLat, lng: avgLng };
}
// function getDistance(init: Record<string, number>, next: Record<string, number>) {
//     const distance = ((next.lat - init.lat) ** 2 + (next.lng - init.lng) ** 2) ** 0.5;
//     return distance;
// }
function getDistance(start: Record<string, number>, end: Record<string, number>) {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const earthRadius = 6371000; // Radius of the Earth in meters
    const lat1 = toRadians(start.lat);
    const lat2 = toRadians(end.lat);
    const lon1 = toRadians(start.lng);
    const lon2 = toRadians(end.lng);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
}

function pushToCircuit(venue: Record<string, any>) {
    if (!idPool.value.includes(venue.id)) {
        circuit.value.push(venue);
        idPool.value.push(venue.id);
        console.log('idPool.value', idPool.value);
        console.log('circuit.value', circuit.value);
        toast.success(`${venue.name} added!`, { timeout: 1300 });
    } else {
        toast.error(`${venue.name} already added!`, { timeout: 1300 });
    }
}

// 1) GEOCODE: lat/long coordinates of given address
let map: any;
async function getStart(address: string) {
    // @ts-expect-error googleAPI
    const { AdvancedMarkerElement: Marker } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
    // @ts-expect-error googleAPI
    const { Geocoder, Map } = await google.maps;

    traceStep.value++;
    try {
        const geocoder = await new Geocoder();
        await geocoder.geocode(
            {
                address: address
            },
            (res: Record<string, any>[]) => {
                console.log('res', res[0]);
                start.value = getLatLong(res[0]);
                console.log('start.value', start.value);
            }
        );

        const mapOptions = {
            mapId: '4e239a6eb5e69b0c',
            center: start.value,
            zoom: 15,
        };

        map = await new Map(document.getElementById('map') as HTMLElement, mapOptions);
        const startMarker = document.createElement('div');
        startMarker.innerHTML
            = `<div class="bg-neutral rounded-full opacity-[0.9] hover:opacity-100 p-0.5 hover:scale-125">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 fill-accent" viewBox="0 0 256 256"><path d="M120,56a32,32,0,1,1,32,32A32,32,0,0,1,120,56Zm103.28,74.08a8,8,0,0,0-10.6-4c-.25.12-26.71,10.72-72.18-20.19-52.29-35.54-88-7.77-89.51-6.57a8,8,0,1,0,10,12.48c.26-.21,25.12-19.5,64.07,3.27-4.25,13.35-12.76,31.82-25.25,47-18.56,22.48-41.11,32.56-67,30A8,8,0,0,0,31.2,208a92.29,92.29,0,0,0,9.34.47c27.38,0,52-12.38,71.63-36.18.57-.69,1.14-1.4,1.69-2.1C133.31,175.29,168,190.3,168,232a8,8,0,0,0,16,0c0-24.65-10.08-45.35-29.15-59.86a104.29,104.29,0,0,0-31.31-15.81A169.31,169.31,0,0,0,139,124c26.14,16.09,46.84,20,60.69,20,12.18,0,19.06-3,19.67-3.28A8,8,0,0,0,223.28,130.08Z"></path></svg>
                    <div class="absolute top-[90%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[0.9rem] border-r-[0.9rem] border-t-[1.33rem] border-solid border-r-transparent border-l-transparent border-t-neutral -z-10"></div>
            </div>`;
        const marker = new Marker({
            map,
            position: start.value,
            title: 'Start',
            content: startMarker,
        });
    } catch (error) {
        console.error(error);
    }
}

// 2) NEARBY SEARCH: for places of given ['type'] and 'radius'
async function nearby(radius: number, type: string | string[]) {
    // @ts-expect-error googleAPI
    const { AdvancedMarkerElement: Marker } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
    // @ts-expect-error googleAPI
    const { InfoWindow, places: { PlacesService: Places } } = await google.maps;

    const nearby = await new Places(document.getElementById('nearby'));
    await nearby.nearbySearch(
        {
            location: start.value,
            radius: radius,
            type: type,
            // rankBy: google.maps.places.RankBy.DISTANCE,
            // Note: Nearby Search does NOT allow concurrent use of rankBy(distance) + radius fields
        },
        (results: Record<string, any>[]) => {
            console.log('results', results);

            const venues: any = results
                .filter(res => res.business_status === 'OPERATIONAL')
                .map(res => ({
                    name: res.name,
                    types: res.types,
                    rating: res.rating,
                    totalReviews: res.user_ratings_total,
                    price: res.price_level,
                    position: getLatLong(res),
                    distance: getDistance(start.value, getLatLong(res)),
                }));

            // Use Tim Sort to sort by distance (closest to farthest)
            timSort(venues, (venue: any) => venue.distance);
            console.log('VENUES', venues);
            nearbyData.value = venues;

            const infoWindow = new InfoWindow();

            venues.forEach(({ position, name, rating, totalReviews, types }, i) => {
                const markerTag = document.createElement('div');
                markerTag.innerHTML = buildTag(types, i);

                const markerInfo = document.createElement('div');
                markerInfo.innerHTML = `
                <div class="stats">
                    <div class="stat p-1 pb-0 pt-0">
                        <div class="col-start-1 text-lg text-primary font-medium">${i + 1}. ${name}</div>
                        <div class="col-start-1 text-lg font-semibold"><span class="text-accent">${rating}</span> / 5</div>
                        <div class="col-start-1 text-xs text-base-content/80 font-medium">Based on ${totalReviews} reviews</div>
                </div>
                `;

                const marker = new Marker({
                    map,
                    position,
                    title: `${i + 1}. ${name}`,
                    content: markerTag,
                });
                marker.addListener('click', () => {
                    infoWindow.close();
                    infoWindow.setContent(markerInfo);
                    infoWindow.open(marker.map, marker);
                    map.panTo(marker.position);
                });
            });

            console.log('nearbyData.value', nearbyData.value);
        }
    );
}

// @ts-expect-error googleAPI
let allMarkers: Record<string, google.maps.Marker[]> = {};
// @ts-expect-error googleAPI
const selectMarkers: Record<string, google.maps.Marker[]> = {};
// 3) TEXT SEARCH: query is more versatile than providing strict 'types'
// TODO: On 1st query added, remove query(1) markers, populate query(2) markers... etc
async function textSearch(query: string, radius: number) {
    // @ts-expect-error googleAPI
    const { AdvancedMarkerElement: Marker } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
    // @ts-expect-error googleAPI
    const { InfoWindow, places: { PlacesService: Places } } = await google.maps;

    traceStep.value++;
    const service = await new Places(document.getElementById('textsearch'));
    await service.textSearch(
        {
            location: start.value,
            radius: radius,
            query: query,
            // Note: Use 'or' operator | to construct more flexible queries
        },
        (results: Record<string, any>[]) => {
            console.log('results', results);
            const venues: any = results
                .filter(res => res.business_status === 'OPERATIONAL')
                .filter(res => getDistance(start.value, getLatLong(res)) <= radius)
                .map(res => ({
                    id: res.place_id,
                    address: res.formatted_address.replace(/, United States$/, ''),
                    name: res.name,
                    types: res.types,
                    rating: res.rating,
                    totalReviews: res.user_ratings_total,
                    price: res.price_level,
                    position: getLatLong(res),
                    distance: getDistance(start.value, getLatLong(res)),
                }));

            // Use Tim Sort to sort by distance (closest to farthest)
            timSort(venues, (venue: any) => venue.distance);

            textSearchData.value = venues;
            console.log('textSearchData.value', textSearchData.value);

            // Increment query count to track next Text Search in queue
            queryCount.value++;
            console.log('queryCount.value', queryCount.value);

            const infoWindow = new InfoWindow();

            textSearchData.value.forEach((venue: any, i: number) => {
                const { position, name, address, rating, totalReviews, types, id, distance } = venue;

                const markerTag = document.createElement('div');
                markerTag.innerHTML = buildTag(types, i);

                const markerInfo = document.createElement('div');
                markerInfo.innerHTML = `
                <div class="stats">
                    <div class="stat p-1 pb-0 pt-0">
                        <div class="col-start-1 text-lg text-base-content font-medium">${i + 1}. <span class="text-primary">${name}</span>
                        </div>
                        <div class="col-start-1 text-xs font-normal">${address}<span class="text-xs font-normal"> - (${Math.floor(distance)}m)</span></div>
                        <div class="col-start-1 text-lg font-semibold"><span class="text-accent">${rating}</span> / 5</div>
                        <div class="col-start-1 text-xs text-base-content/80 font-medium">Based on ${totalReviews} reviews</div>
                        <div class="flex justify-center pt-2">
                            <button id="toCircuit-${i}" class="btn btn-xs btn-primary">Add</button>
                        </div>
                    </div>
                </div>`;

                const marker = new Marker({
                    map,
                    position,
                    title: `${i + 1}. ${name}`,
                    content: markerTag,
                });

                const query = queryPool.value[queryCount.value - 1];
                if (!(query in allMarkers)) {
                    allMarkers[query] = [];
                }
                allMarkers[query].push(marker);

                const button = markerInfo.querySelector(`#toCircuit-${i}`);
                if (button) {
                    button.addEventListener('click', () => {
                        // Initialize array for each marker-query
                        if (!(query in selectMarkers)) {
                            selectMarkers[query] = [marker];
                        // Push the marker if not already in the array
                        } else if (!selectMarkers[query].includes(marker)) {
                            selectMarkers[query].push(marker);
                        }
                        console.log('selectMarkers', selectMarkers);

                        pushToCircuit(textSearchData.value[i]);
                        if (infoWindow) {
                            infoWindow.close();
                        }
                        // Hide all markers except for selected one
                        hideMarkers();

                        console.log('queryCount.value', queryCount.value);
                        console.log('queryPool.value', queryPool.value);
                        // Continue Text Search for next query in queue
                        if (queryCount.value < queryPool.value.length) {
                            textSearch(queryPool.value[queryCount.value], 1610);
                        }
                    });
                } else {
                    console.error(`Missing button for marker #${i}!`);
                }

                marker.addListener('click', () => {
                    infoWindow.close();
                    infoWindow.setContent(markerInfo);
                    infoWindow.open(marker.map, marker);
                    map.panTo(marker.position);
                });
            });
        }
    );
}

// @ts-expect-error googleAPI
function setSelectMarkers(map: google.maps.Map | null) {
    const query = queryPool.value[queryCount.value - 1];
    allMarkers[query].forEach(marker => {
        if (!selectMarkers[query].includes(marker)) {
            marker.setMap(map);
        }
    });
}
function hideMarkers(): void {
    setSelectMarkers(null);
}
function showMarkers(): void {
    setSelectMarkers(map);
}
function unSelectMarkers() {
    const query = queryPool.value[queryCount.value - 1];
    for (const marker of allMarkers[query]) {
        marker.setMap(null);
    }
}
function deleteUnselected(): void {
    hideMarkers();
    allMarkers = {};
}

async function trace(venues: Record<string, any>[]) {
    // @ts-expect-error googleAPI
    const routeService = await new google.maps.DirectionsService();
    // @ts-expect-error googleAPI
    const routeRender = await new google.maps.DirectionsRenderer();
    routeRender.setMap(map);

    const waypoints = venues
        // Exclude last venue (this will be destination)
        .slice(0, venues.length - 1)
        .map(venue => ({
            location: venue.position,
            stopover: true,
        }));
    await routeService.route(
        {
            origin: start.value,
            destination: venues[venues.length - 1].position,
            waypoints,
            travelMode: 'WALKING', // 'DRIVING' 'BICYCLING'
        },
        (res: Record<string, any>, status: string) => {
            console.log('res', res);
            if (status === 'OK') {
                routeRender.setDirections(res);
            } else {
                console.error(`Routing failed: ${status}`);
            }
        }
    );
}

function buildTag(types: string[], index: number): string {
    // Map types to corresponding icons (colors not set up yet)
    const typeMap: Record<string, { icon: string; color: string }> = {
        'drugstore': { icon: drugPath(), color: 'primary' },
        'night_club': { icon: nightclubPath(), color: 'accent' },
        'museum': { icon: artPath(), color: 'neutral-content' },
        'art_gallery': { icon: artPath(), color: 'neutral-content' },
        'cafe': { icon: cafePath(), color: 'neutral-content' },
        'restaurant': { icon: restaurantPath(), color: 'neutral-content' },
        'bar': { icon: barPath(), color: 'primary' },
        'movie_theater': { icon: moviePath(), color: 'neutral-content' },
        'car': { icon: carPath(), color: 'neutral-content' },
        'default': { icon: storePath(), color: 'neutral-content' },
    };

    const matchedType = types.find(type => type in typeMap);
    const { icon, color } = typeMap[matchedType || 'default'];

    return `
        <div class="bg-neutral rounded-full opacity-[0.9] hover:opacity-100 p-1 hover:scale-125">
            ${icon}
            <div class="absolute top-[50%] left-[49%] -translate-x-1/2 -translate-y-1/2 text-neutral-content text-xs font-medium opacity-100">
                ${index + 1}
            </div>
        </div>
    `;
}

function toQueryQueue(query: string) {
    if (!queryPool.value.includes(query)) {
        queryPool.value.push(query);
        toast.success(`Search for ${query} added!`, { timeout: 1200 });
    } else {
        toast.error(`${query} already in queue!`, { timeout: 1200 });
    }
    textQuery.value = '';
}
function removeQuery(delQuery: string, queryIdx: number) {
    queryPool.value.splice(queryIdx, 1);
    console.log('queryPool.value', queryPool.value);
    toast.info(`${delQuery} removed!`, { timeout: 1200 });
}

// ----------------------------------------------------------------
</script>

<template>
    <div class="flex justify-center pb-2">
        <ul class="steps">
            <li class="step" :class="traceStep >= 0 ? 'step-primary' : ''">Start</li>
            <li class="step" :class="traceStep > 0 ? 'step-primary' : ''">Plan</li>
            <li class="step" :class="traceStep > 1 ? 'step-primary' : ''">Play</li>
            <li class="step" :class="traceStep > 2 ? 'step-primary' : ''">Trace</li>
        </ul>
    </div>

    <div id="textsearch" class="flex justify-center">

        <div v-if="traceStep < 1">
            <div class="flex justify-center py-2">
                <h1 class="text-primary text-2xl">
                    Starting point.
                </h1>
            </div>
            <div class="inline pb-2">
                <input v-model="startAddress" type="text" name="startAddress" placeholder="Enter starting point"
                    class="form-control input input-bordered form-input mb-1" @keyup.enter="getStart(startAddress)" />
                <button class="btn btn-sm btn-primary" @click="getStart(startAddress)">Start</button>
            </div>
        </div>

        <div v-if="traceStep === 1">
            <div class="flex justify-center py-2">
                <h1 class="text-primary text-2xl">
                    What's the move?
                </h1>
            </div>
            <div class="grid">
                <input v-model="textQuery" type="text" name="textQuery" placeholder="Cafe, museum, clubs..."
                    class="form-control input input-bordered form-input mb-2" @keyup.enter="toQueryQueue(textQuery)" />
                <button v-if="queryPool.length > 0" class="btn btn-sm btn-primary" @click="textSearch(queryPool[0], 1610)">Start Search</button>
            </div>
        </div>

        <div>
            <div class="flex justify-center py-2">
                <h1 class="text-primary text-2xl">
                    Trace.
                </h1>
            </div>
            <button class="btn btn-sm btn-primary" @click="trace(circuit)">Trace</button>
        </div>

    </div>

    <div class="inline-flex">
        <div id="map"></div>
        <div class="inline pl-2">

            <h1 class="text-primary text-xl">Queries:</h1>

            <div v-for="(query, index) in queryPool" id="checklist" :key="index">
                <input :id="`0${index + 1}`" :checked="Object.keys(selectMarkers).length > index" :value="index + 1" type="checkbox" />
                <label :for="`0${index + 1}`"><span class="whitespace-nowrap">{{ `${index + 1}. ${query}` }}</span></label>
            </div>

            <h1 class="text-primary text-xl">Circuit:</h1>
            <ul>
                <li v-for="(venue, index) in circuit" :key="index" class="text-sm">
                    <span class="font-semibold leading-relaxed tracking-wide">{{ `${index + 1}. ${venue.name}` }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
