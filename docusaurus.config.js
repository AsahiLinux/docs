module.exports = {
  title: 'AsahiLinux Docs',
  tagline: 'Linux for Apple Silicon Macs',
  url: 'https://asahilinux.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'asahilinux',
  projectName: 'docs',
  themeConfig: {
    navbar: {
      title: 'AsahiLinux',
      logo: {
        alt: 'Logo',
        src: 'img/tux.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/asahilinux',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'FAQ',
              to: 'docs/faq',
            },
            {
              label: 'Progress',
              to: 'docs/progress',
            }
          ],
        },
        {
          title: 'Support',
          items: [
            {
              label: 'Patreon',
              href: 'https://www.patreon.com/marcan',
            },
            {
              label: 'Github Sponsors',
              href: 'https://github.com/sponsors/marcan',
            }
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/AsahiLinux',
            }
          ],
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AsahiLinux. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/asahilinux/docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/asahilinux/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
