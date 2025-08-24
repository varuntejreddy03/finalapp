import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuTarget,
    LuUser,
    LuList,
    LuLogOut,
} from "react-icons/lu";


export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Income",
        icon: LuWalletMinimal,
        path: "/income",
    },
    {
        id: "03",
        label: "Expense",
        icon: LuHandCoins,
        path: "/expense",
    },
    {
        id: "04",
        label: "Goals",
        icon: LuTarget,
        path: "/goals",
    },
    {
        id: "05",
        label: "Transactions",
        icon: LuList,
        path: "/transactions",
    },
    {
        id: "06",
        label: "Profile",
        icon: LuUser,
        path: "/profile",
    },

    {
        id: "07",
        label: "Log Out",
        icon: LuLogOut,
        path: "/logout",
    },
];