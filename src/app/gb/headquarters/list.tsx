'use client';

import { ListTile } from "@/src/components/listtile/listtile";
import { Loader } from "@/src/components/loader/loader";
import { ReactQueryKeys } from "@/src/shared/enums";
import { useHttpClient } from "@/src/shared/useHttpClient";
import { useMenu } from "@/src/shared/useMenu";
import { Alert, Box, Button, Group, LoadingOverlay, Modal, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbPlus } from "react-icons/tb";
import { HeadquartersForm } from "./form";

export function HeadquartersList() {
  const client = useHttpClient();
  const t = useTranslations('ghostbusters.headquarters');
  const router = useRouter();
  const menu = useMenu();
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Ghostbusters.headquartersList],
    queryFn: async () => {
      return await client.get('/gb/api/headquarters') as ListItem[];
    },
  });

  return <>
    <Title order={2}>{t('title')}</Title>
    <Loader visible={isFetching && !data} />
    {menu && menu.checkPermission('ghostbusters', 'create') && <Group justify={"end"}>
      <Button leftSection={<TbPlus />} onClick={open}>
        {t('new')}
      </Button>
      <Modal opened={opened} onClose={close} centered title={t("form.title")} size={"lg"}>
        <HeadquartersForm onSubmit={close}/>
      </Modal>
    </Group>}
    {data && data.length > 0 &&
      <Box pos={"relative"}>
        <LoadingOverlay visible={loading || isFetching} />
        {data.map(s => <ListTile
            key={s.id}
            title={s.description}
            onClick={() => {
              setLoading(true);
              router.push(`/gb/headquarters/${s.id}`);
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