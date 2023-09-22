export default function (theme: any) {
    const formBg = computed(() => {
        return {
            'bg-base-200/95': theme === 'dracula' || 'night',
            'bg-slate-800/95 brightness-[1.25]': theme === 'fantasy' || 'corporate',
        };
    });

    return { formBg };
}
