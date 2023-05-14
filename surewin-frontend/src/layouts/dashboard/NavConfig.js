// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: "dashboard",
    path: "/dashboard",
    icon: getIcon("ic:baseline-dashboard"),
    access: ["admin"],
  },
  {
    title: "payments",
    path: "/payments",
    icon: getIcon("ic:baseline-payments"),
  },
  {
    title: "tenants",
    path: "/tenants",
    icon: getIcon("fluent:people-12-filled"),
    access: ["admin", "manager"],
  },
  {
    title: "utilities",
    path: "/utilities",
    icon: getIcon("akar-icons:settings-horizontal"),
    access: ["admin"],
  },
  {
    title: "staff",
    path: "/staff",
    icon: getIcon("fluent:people-community-20-filled"),
    access: ["admin"],
  },
  {
    title: "property units",
    path: "/property-units",
    icon: getIcon("healthicons:market-stall"),
    access: ["admin"],
  },

  {
    title: "contract",
    path: "/contract",
    icon: getIcon("eva:file-text-fill"),
    access: ["tenant"],
  },
  {
    title: "reports",
    path: "/reports",
    icon: getIcon("eva:file-text-fill"),
    access: ["admin", "manager"],
  },
  {
    title: "Archive",
    path: "/archive_contracts",
    icon: getIcon("material-symbols:archive"),
    access: ["admin"],
  },
];

export default navConfig;
