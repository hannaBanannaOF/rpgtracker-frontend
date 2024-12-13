'use client';

import { Switch, useMantineColorScheme } from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { useTranslations } from "next-intl";

export function SwitchTheme() {
  const t = useTranslations("menu.theme_switch");
  const mounted = useMounted();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  if(!mounted) return null

  return (
    <Switch checked={colorScheme === 'dark'} onChange={() => {
      colorScheme === 'dark' ? setColorScheme('light') : setColorScheme('dark')
    }} onLabel={t('label_on')} offLabel={t('label_off')} label={`${t('title')}: `} labelPosition="left"/>
  )
}