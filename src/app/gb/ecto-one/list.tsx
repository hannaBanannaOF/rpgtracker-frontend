'use client';

import { ListTile } from "@/src/components/listtile/listtile";
import { Alert, Box, Button, Flex, Loader, LoadingOverlay, Modal, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ListItem } from "../types";
import { useRouter } from "next/navigation";
import { useMenu } from "@/src/shared/useMenu";
import { TbPlus } from "react-icons/tb";
import { useDisclosure } from "@mantine/hooks";
import { EctoOneForm } from "./form";

export const getItems = async () => {
  return await fetch('/gb/api/ecto-one').then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  }).then(json => {
    return json;
  }) as ListItem[];
}

export function EctoOneList() {
  const t = useTranslations('ghostbusters.ecto_one');
  const router = useRouter();
  const {data, isFetching } = useQuery({
    queryKey: ['gb-ecto-one-list'],
    queryFn: () => getItems(),
  });

  const menu = useMenu();

  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  return <>
    <Title order={2}>{t('title')}</Title>
    {menu.loading && isFetching && !data && <Flex mt="md" justify={"center"}>
      <Loader type="bars"/>  
    </Flex>}
    {data && data.length > 0 &&
      <Box pos={"relative"}>
        <LoadingOverlay visible={loading || isFetching} />
        {menu && menu.checkPermission('ghostbusters', 'create') && <Flex justify={"end"}>
          <Button leftSection={<TbPlus />} onClick={open}>
            {t('new')}
          </Button>
          <Modal opened={opened} onClose={close} centered title={t("form.title")} size={"lg"}>
            <EctoOneForm formTranslationNamespace="ghostbusters.ecto_one.form" onSubmit={close}/>
          </Modal>
        </Flex>}
        {data.map(s => <ListTile
            key={s.id}
            title={s.description}
            onClick={() => {
              setLoading(true);
              router.push(`/gb/ecto-one/${s.id}`);
            }}
          />
        )}
      </Box>
    }
    {!isFetching && data && data.length == 0 && <Alert variant="light" color="red" mt="md">
      <Text size="md">{t('no_data')}</Text>  
    </Alert>}
  </>
}