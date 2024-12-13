'use client';

import { SwitchTheme } from "@/src/components/themeswitch/switchtheme";
import { AppShell, Avatar, Burger, Flex, Menu, NavLink } from "@mantine/core";
import { useDisclosure, useInViewport } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { GiScrollUnfurled, GiTabletopPlayers } from "react-icons/gi";
import { TbHome } from "react-icons/tb";

export function Shell({children}: {children: React.ReactNode}) {

  const t = useTranslations("menu");

  const [opened, { toggle }] = useDisclosure();
  const { ref, inViewport } = useInViewport();
  const pathname = usePathname();

  return <AppShell
    header={{ height: 60 }}
    navbar={{
      width: 300,
      breakpoint: 'sm',
      collapsed: { mobile: !opened },
    }}
    padding="md"
    styles={{
      header: {
        backgroundColor: 'var(--mantine-color-rpgtracker-teal-9)',
        boxShadow: 'var(--mantine-shadow-md)'
      }
    }}
  >
    <AppShell.Header withBorder={false}>
      <Flex justify={inViewport ? 'space-between' : 'flex-end'} align='center' direction='row' h='100%' px='md'>
        <Burger
          ref={ref}
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />
        <Menu position="bottom-end">
          <Menu.Target>
            <Avatar size="md" variant="filled" styles={{
              root: {
                cursor: 'pointer',
              }
            }} />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item closeMenuOnClick={false}>
              <SwitchTheme />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </AppShell.Header>

    <AppShell.Navbar py="md" withBorder>
      <NavLink
        href="/"
        label={t('link_home')}
        leftSection={<TbHome size={24}/>}
        variant={"light"}
        autoContrast
        active={pathname === '/'}
      />
      <NavLink
        href="/me/sessions"
        label={t('link_sessions')}
        leftSection={<GiTabletopPlayers size={24}/>}
        variant={"light"}
        autoContrast
        active={pathname === '/me/sessions' || pathname.includes('/session')}
      />
      <NavLink
        href="/me/sheets"
        label={t('link_sheets')}
        leftSection={<GiScrollUnfurled size={24}/>}
        variant={"light"}
        autoContrast
        active={pathname === '/me/sheets' || pathname.includes('/character-sheet')}  
      />
    </AppShell.Navbar>
    <AppShell.Main>
      {children}
    </AppShell.Main>
  </AppShell>
}