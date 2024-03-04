export default function () {
    const themeCookie = useCookie('selectedTheme');
    const selectTheme = themeCookie.value as string;
    const formBg = computed(() => {
        return {
            'bg-base-200/95': selectTheme === 'dracula' || 'night',
            'bg-slate-800/95 brightness-[1.25]': selectTheme === 'fantasy' || 'corporate',
        };
    });

    return { formBg, themeCookie, selectTheme };
}
