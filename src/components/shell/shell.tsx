'use client';

import { SwitchTheme } from "@/src/components/themeswitch/switchtheme";
import { useMenu } from "@/src/shared/useMenu";
import { AppShell, Avatar, Box, Burger, Divider, Group, LoadingOverlay, Menu, NavLink } from "@mantine/core";
import { useDisclosure, useInViewport } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { GiFloatingGhost, GiScrollUnfurled, GiTabletopPlayers } from "react-icons/gi";
import { TbHome } from "react-icons/tb";
import { Loader } from "../loader/loader";

export function Shell({children}: {children: React.ReactNode}) {
  const menu = useMenu();

  const t = useTranslations("menu");

  const [opened, { toggle }] = useDisclosure();
  const { ref, inViewport } = useInViewport();
  const pathname = usePathname();

  const showMenu = (menuLabel: string): boolean => {
    if (menu.data == null) {
      return false;
    }
    return menu.data.sideMenu.menu.filter((i) => {
      return i.label === menuLabel
    }).length > 0;
  }

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
      <Group justify={inViewport ? 'space-between' : 'flex-end'} align='center' h='100%' px='md'>
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
      </Group>
    </AppShell.Header>

    <AppShell.Navbar py="md" withBorder>
      <Box pos={"relative"}>
        <LoadingOverlay visible={menu.loading && menu.data != null}/>
        <Loader visible={menu.loading && !menu.data} />
        {showMenu('link_home') && <NavLink
          href="/"
          label={t('link_home')}
          leftSection={<TbHome size={24}/>}
          variant={"light"}
          autoContrast
          active={pathname === '/'}
        />}
        {showMenu('link_sessions') && <NavLink
          href="/me/sessions"
          label={t('link_sessions')}
          leftSection={<GiTabletopPlayers size={24}/>}
          variant={"light"}
          autoContrast
          active={pathname === '/me/sessions' || pathname.includes('/session')}
        />}
        {showMenu('link_sheets') && <NavLink
          href="/me/sheets"
          label={t('link_sheets')}
          leftSection={<GiScrollUnfurled size={24}/>}
          variant={"light"}
          autoContrast
          active={pathname === '/me/sheets' || pathname.includes('/character-sheet')}  
        />}
        {showMenu('ghostbusters.main') && <>
          <Divider my={"md"}/>
          <NavLink
            href="#"
            label={t('ghostbusters.main')}
            leftSection={<GiFloatingGhost size={24}/>}
            variant={"light"}
            autoContrast
            active={pathname.includes('/gb') && (!pathname.includes('/session') && !pathname.includes('/character-sheet'))}  
          >
            <NavLink 
              href="/gb/ecto-one"
              label={t('ghostbusters.ecto_one')}
              active={pathname.includes('/gb/ecto-one') && !pathname.includes('ecto-one-upgrades')}  
            />
            <NavLink 
              href="/gb/ecto-one-upgrades"
              label={t('ghostbusters.ecto_one_upgrades')}
              active={pathname.includes('/gb/ecto-one-upgrades')}  
            />
            <NavLink 
              href="/gb/equipment"
              label={t('ghostbusters.equipment')}
              active={pathname.includes('/gb/equipment') && !pathname.includes('/gb/equipment-upgrades')}  
            />
            <NavLink 
              href="/gb/equipment-upgrades"
              label={t('ghostbusters.equipment_upgrades')}
              active={pathname.includes('/gb/equipment-upgrades')}  
            />
            <NavLink 
              href="/gb/talents"
              label={t('ghostbusters.talents')}
              active={pathname.includes('/gb/talents')}  
            />
            <NavLink 
              href="/gb/headquarters"
              label={t('ghostbusters.headquarters')}
              active={pathname.includes('/gb/headquarters')}  
            />
          </NavLink>
        </>}
      </Box>
    </AppShell.Navbar>
    <AppShell.Main>
      {children}
    </AppShell.Main>
  </AppShell>
}