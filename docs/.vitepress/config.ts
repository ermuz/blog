import { defineConfig } from 'vitepress';
import type { DefaultTheme } from 'vitepress/types/default-theme'

const menu = [
    {
        text: '首页',
        link: '/',
        activeMatch: `^/$`,
        path: '/'
    },
    {
        text: '前端三剑客',
        activeMatch: `^/three-musketeers`,
        path: '/three-musketeers',
        items: [
            {
                text: 'Html',
                items: [
                    {
                        text: '基础',
                        link: '/three-musketeers/html/basic',
                    },
                    {
                        text: '进阶',
                        link: '/three-musketeers/html/advance',
                    },
                ]
            },
            {
                text: 'CSS',
                items: [
                    {
                        text: 'css',
                        link: '/three-musketeers/css/css',
                    },
                    {
                        text: 'less',
                        link: '/three-musketeers/css/less',
                    },
                    {
                        text: 'sass',
                        link: '/three-musketeers/css/sass',
                    },
                    {
                        text: 'stylus',
                        link: '/three-musketeers/css/stylus',
                    },
                ]
            },
            {
                text: 'JavaScript',
                items: [
                    {
                        text: '基础',
                        link: '/three-musketeers/js/basic',
                        activeMatch: `^/three-musketeers/js/basic`,
                        items: [
                            {
                                text: 'es5',
                                link: '/three-musketeers/js/basic/es5'
                            },
                            {
                                text: 'es6+',
                                link: '/three-musketeers/js/basic/es6+',
                            }
                        ]
                    },
                    {
                        text: '进阶',
                        link: '/three-musketeers/js/advance',
                        activeMatch: `^/three-musketeers/js/advance`,
                        items: [
                            {
                                text: '事件循环',
                                link: '/three-musketeers/js/advance/event-loop'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        text: '数据结构与算法',
        activeMatch: `^/data-structures-and-algorithms`,
        // link: '/data-structures-and-algorithms',
        path: '/data-structures-and-algorithms',
        items: [
            {
                text: '数据结构',
                link: '/data-structures-and-algorithms/data-structures'
            },
            {
                text: '算法',
                link: '/data-structures-and-algorithms/algorithms'
            },
            {
                text: '手写',
                link: '/data-structures-and-algorithms/handwriting'
            }
        ]
    },
    {
        text: '工程化',
        activeMatch: `^/engineering`,
        path: '/engineering',
        items: [
            {
                text: '规范',
                items: [
                    {
                        text: '代码规范',
                        link: '/engineering/standard/code'
                    },
                    {
                        text: 'Git规范',
                        link: '/engineering/standard/git'
                    },
                    {
                        text: '项目规范',
                        link: '/engineering/standard/project'
                    },
                    {
                        text: 'UI规范',
                        link: '/engineering/standard/ui'
                    }
                ]
            },
            {
                text: '构建工具',
                items: [
                    {
                        text: 'Webpack',
                        link: '/engineering/construct/webpack',
                    },
                    {
                        text: 'Vite',
                        link: '/engineering/construct/vite',
                    },
                    {
                        text: 'Rollup',
                        link: '/engineering/construct/rollup',
                    },
                    {
                        text: 'EsBuild',
                        link: '/engineering/construct/esbuild',
                    }
                ]
            },
            {
                text: '测试',
                items: [
                    {
                        text: '单元测试',
                        link: '/engineering/testing/unit',
                    },
                    {
                        text: '端到端测试',
                        link: '/engineering/testing/e2e',
                    },
                ]
            },
            {
                text: '部署',
                items: [
                    {
                        text: 'Docker',
                        link: '/engineering/deploy/docker',
                    },
                    {
                        text: 'Jenkins',
                        link: '/engineering/deploy/jenkins',
                    },
                    {
                        text: 'Nginx',
                        link: '/engineering/deploy/nginx',
                    },
                    {
                        text: 'Kubernetes',
                        link: '/engineering/deploy/kubernetes',
                    },
                ]
            },
            {
                text: '监控',
                items: [
                    {
                        text: '性能数据',
                        link: '/engineering/monitoring/performance',
                    },
                    {
                        text: '异常数据',
                        link: '/engineering/monitoring/error',
                    },
                    {
                        text: '行为数据',
                        link: '/engineering/monitoring/action',
                    },
                    {
                        text: '日志上报',
                        link: '/engineering/monitoring/report',
                    },
                ]
            },
        ]
    },
    {
        text: '框架和类库',
        activeMatch: `^/framework-and-lib`,
        path: '/framework-and-lib',
        items: [
            {
                text: '框架',
                items: [
                    {
                        text: 'Vue',
                        link: '/framework-and-lib/frameworks/vue'
                    },
                    {
                        text: 'React',
                        link: '/framework-and-lib/frameworks/react'
                    },
                    {
                        text: 'Svelte',
                        link: '/framework-and-lib/frameworks/svelte'
                    }
                ]
            },
            {
                text: '类库',
                items: [
                    {
                        text: 'TypeScript',
                        link: '/framework-and-lib/libs/typescript',
                    },
                    {
                        text: 'Lodash',
                        link: '/framework-and-lib/libs/lodash'
                    },
                    {
                        text: 'Axios',
                        link: '/framework-and-lib/libs/axios'
                    }
                ]
            },
        ]
    },
    {
        text: '浏览器与计网',
        activeMatch: `^/brower-computer-network`,
        path: '/brower-computer-network',
        items: [
            {
                text: '浏览器',
                items: [
                    {
                        text: '基础',
                        link: '/brower-computer-network/brower/abc',
                        items: [
                            {
                                text: '缓存',
                                link: '/brower-computer-network/brower/abc/cache'
                            }
                        ]
                    },
                    {
                        text: 'API',
                        link: '/brower-computer-network/brower/api'
                    },
                ]
            },
            {
                text: '计算机网络',
                items: [
                    {
                        text: '网络协议',
                        link: '/brower-computer-network/computer-network/protocol'
                    },
                    {
                        text: '设计模式',
                        link: '/brower-computer-network/computer-network/design-patterns'
                    },
                    {
                        text: '编译原理',
                        link: '/brower-computer-network/computer-network/compilation-principle'
                    },
                ]
            },
        ]
    },
    {
        text: '全栈技能',
        activeMatch: `^/full-stack`,
        path: '/full-stack',
        items: [
            {
                text: 'Node',
                items: [
                    {
                        text: 'Node基础',
                        link: '/full-stack/node/abc'
                    },
                    {
                        text: '框架',
                        link: '/full-stack/node/framework'
                    },
                ]
            },
            {
                text: '大数据',
                items: [
                    {
                        text: 'Kafka',
                        link: '/full-stack/data/kafka'
                    },
                    {
                        text: 'ClickHouse',
                        link: '/full-stack/data/click-house'
                    },
                ]
            },
        ]
    },
    {
        text: '多端技能',
        activeMatch: `^/cross-end`,
        path: '/cross-end',
        items: [
            {
                text: '小程序',
                items: [
                    {
                        text: 'Mina',
                        link: '/cross-end/miniprogram/mina'
                    },
                    {
                        text: 'UniApp',
                        link: '/cross-end/miniprogram/uniapp'
                    },
                ]
            },
            {
                text: '移动端',
                items: [
                    {
                        text: 'Hybrid',
                        link: '/cross-end/mobile/hybrid'
                    },
                    {
                        text: 'Weex',
                        link: '/cross-end/mobile/weex'
                    },
                    {
                        text: 'ReactNative',
                        link: '/cross-end/mobile/react-native',
                        items: [
                            {
                                text: '环境搭建',
                                link: '/cross-end/mobile/react-native/environment-setup'
                            }
                        ]
                    },
                ]
            },
            {
                text: '桌面端',
                items: [
                    {
                        text: 'Electron',
                        link: '/cross-end/desktop/electron'
                    },
                ]
            },
        ]
    },


    // {
    //     text: '文章',
    //     link: '/article',
    //     activeMatch: `^/article`,
    //     path: '/article',
    // },
    // {
    //     text: '代码',
    //     link: '/code',
    //     activeMatch: `^/code/`,
    //     path: '/code',
    // },
    // {
    //     text: '集锦',
    //     link: '/collect',
    //     activeMatch: `^/collect`,
    //     path: '/collect',
    // },
]

const nav = () => {
    return menu.map(({ text, link, activeMatch, items }) => ({ text, link, activeMatch, items }))
}

const sidebar = () => {
    const side = {}

    menu.filter(item => item.items && item.items.some(sub => sub.items)).forEach(item => {
        side[item.path] = item.items;
        // @ts-ignore
        delete item.path
    })
    return side
}

export default defineConfig({
    title: 'ermuz',
    description: '二木的博客',
    lang: 'zh-CN',
    base: '/blog/',
    // srcDir: 'src',
    outDir: '../dist',
    markdown: {
        theme: 'material-palenight',
        lineNumbers: true
    },
    appearance: true, // 是否展示主题切换
    lastUpdated: true,
    head: [
        // fav
        ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "logo.png" }]
    ],
    themeConfig: {
        logo: 'logo.png',
        siteTitle: '二木的博客', // nav title 默认是 app.title
        // 编辑当前页面的链接
        editLink: {
            pattern: 'blog/docs',
            text: '编辑当前页面'
        },
        outlineTitle: '目录',
        outline: 'deep',
        lastUpdatedText: '最后更新时间',
        nav: nav() as DefaultTheme.NavItem[],
        sidebar: sidebar(),
        // 社交链接
        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/ermuz'
            }
        ],
        docFooter: {
            next: '下一篇',
            prev: '上一篇'
        },
        footer: {
            copyright: `Copyright © 2022-${new Date().getFullYear()} ermuz`
        },
        // algolia: {

        // }
    }
})