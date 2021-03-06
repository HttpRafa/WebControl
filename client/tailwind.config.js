const production = !process.env.ROLLUP_WATCH;
module.exports = {
    enabled: true,
    future: {
        purgeLayersByDefault: true,
        removeDeprecatedGapUtilities: true,
    },
    mode: 'jit',
    purge: {
        content: [
            "./src/**/*.svelte",
        ],
        enabled: production // disable purge in dev
    },
    darkMode: 'class', // class, 'media' or boolean
    theme: {
        extend: {
            colors: {
                gray: {
                    900: '#202225',
                    850: '#242629',
                    800: '#2f3136',
                    700: '#36393f',
                    600: '#4f545c',
                    400: '#d4d7dc',
                    300: '#e3e5e8',
                    200: '#ebedef',
                    100: '#f2f3f5',
                },
                orange: {
                    450: '#f77a22'
                },
            },
            spacing: {
                88: '22rem',
            },
        },
    },
    plugins: [],
};