import nextra from "nextra";

const withNextra = nextra({
    search: true,
    defaultShowCopyCode: true,
    mdxOptions: {
        rehypePrettyCodeOptions: {
            theme: {
                light: 'github-light-default',
                dark: 'github-dark-default'
            },
        },
    },
});

export default withNextra({
    // ... Other Next.js config options
    // output: 'export'
});
