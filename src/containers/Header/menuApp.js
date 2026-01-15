export const adminMenu = [
    {
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.crud-redux', link: '/system/manage-user'
            },

            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
            },
            {
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
        ]
    },
    {
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'

            },
        ]
    },
    {
        name: 'menu.admin.statistical', 
        menus: [
            {
                name: 'menu.admin.statistical-dashboard', link: '/system/admin-dashboard'
            }
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.doctor.manage-info',
        link: '/doctor/manage-profile'
    },
    {
        name: 'menu.doctor.manage-schedule',
        link: '/doctor/manage-schedule'
    },
    {
        name: 'menu.doctor.manage-patient',
        link: '/doctor/manage-patient'
    }
];