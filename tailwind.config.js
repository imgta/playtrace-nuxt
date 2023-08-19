// import defaultTheme from 'tailwindcss/defaultTheme';

module.exports = {
    plugins: [require('@tailwindcss/typography'), require('daisyui')], /* https://daisyui.com/docs/install/ */
    theme: {
        extend: {
            // fontFamily: {
            //     sans: ['Roboto', ...defaultTheme.fontFamily.sans]
            // },
            typography: theme => ({
                DEFAULT: {
                    css: {
                        'a': {
                            // make the default color of anchor tags be the primary color (see daisyui primary below).
                            // used for changing the default color inside the 'prose' class
                            color: theme('textColor.primary'),
                            textDecoration: 'none',
                        },
                        'a:hover': {
                            // underlines when hovered
                            textDecoration: 'underline',
                        },
                    },
                },
            }),
        },
    },
    daisyui: {
        themes: ['fantasy', 'dracula', 'bumblebee', 'night', 'corporate'],
        // themes: [
        //     {
        //         corporate: {

        //             ...require('daisyui/src/theming/themes')['[data-theme=corporate]'],

        //             /* theme colors: see https://daisyui.com/docs/colors/ */
        //             'primary': '#ED7036', // primary color for buttons, etc.
        //             'primary-content': '#FFFFFF', // text color for primary buttons
        //             'secondary': '#D1D5DB', // secondary color for buttons, etc.
        //             'secondary-content': '#6B7078', // text color for secondary buttons
        //             'accent': '#6A63FF', // color for special badge or accents
        //             'accent-focus': '#4D48B2', // focus color for special badge or accents
        //             'accent-content': '#FFFFFF', // text color for special badge or accents
        //             'neutral': '#4A5568', // neutral color for buttons, etc.
        //             'neutral-focus': '#B7BDC2', // focus color
        //             'neutral-content': '#FFFFFF', // text color
        //             'base-100': '#FFFFFF', // 1st background color for sections
        //             'base-200': '#F3F5F5', // 2nd background color for sections
        //             'base-300': '#D8DBDB', // 3rd background color for sections or cards
        //             'base-content': '#374151', // text color on top of base-100 sections
        //             // For a lighter base-content color, append /80, /60, or /40 (eg text-base-content/80)
        //             'info': '#1D59DB', // info toast, blue finalScore color
        //             'info-content': '#FFFFFF', // text color
        //             'success': '#098040', // success toast, green finalScore color
        //             'success-content': '#FFFFFF', // text color
        //             'warning': '#FFB600', // warning toast, yellow finalScore color
        //             'warning-content': '#FFFFFF', // text color
        //             'error': '#D9534F', // error toast, red finalScore color
        //             'error-content': '#FFFFFF', // text color
        //         },
        //     },
        // ], // , 'business'], /* add to element: data-theme='business' for dark theme*/
        // // darkTheme: 'business'
    },
};
