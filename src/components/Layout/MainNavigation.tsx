import { NavLink } from "react-router-dom";
import { Group, Text, ThemeIcon, rem } from "@mantine/core";
import {
  IconRocket,
  IconAccessPoint,
  IconHome,
  IconChartBar,
} from "@tabler/icons-react";
import { createStyles } from "@mantine/styles";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: rem(44),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    padding: `0 ${theme.spacing.md}`,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: "theme.primaryColor",
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

interface NavLinkData {
  icon: any;
  color: string;
  label: string;
  path: string;
}

const data: NavLinkData[] = [
  {
    icon: IconHome,
    color: "blue",
    label: "Dashboard",
    path: "/",
  },
  {
    icon: IconRocket,
    color: "violet",
    label: "Rockets",
    path: "/rockets",
  },
  {
    icon: IconAccessPoint,
    color: "teal",
    label: "Launches",
    path: "/launches",
  },
  {
    icon: IconChartBar,
    color: "grape",
    label: "Statistics",
    path: "/statistics",
  },
];

export function MainNavigation() {
  const { classes, cx } = useStyles();

  const links = data.map((item) => (
    <NavLink
      to={item.path}
      key={item.label}
      className={({ isActive }) =>
        cx(classes.link, { [classes.linkActive]: isActive })
      }
    >
      <Group>
        <ThemeIcon color={item.color} variant="light">
          <item.icon size={16} />
        </ThemeIcon>
        <Text>{item.label}</Text>
      </Group>
    </NavLink>
  ));

  return <nav>{links}</nav>;
}
