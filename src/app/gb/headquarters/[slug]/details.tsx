'use client';

import { DeleteModal } from "@/src/components/deletemodal/deletemodal";
import { Loader } from "@/src/components/loader/loader";
import { PaperCard } from "@/src/components/papercard/papercard";
import { ReactQueryKeys } from "@/src/shared/enums";
import { useHttpClient } from "@/src/shared/useHttpClient";
import { useMenu } from "@/src/shared/useMenu";
import { Box, Button, Group, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { TbTrash } from "react-icons/tb";
import { HeadquartersForm } from "../form";

export function HeadquartersDetails({ slug } : { slug: string }) {
  const t = useTranslations('ghostbusters.headquarters.details');
  const menu = useMenu();
  const router = useRouter();
  const queryClient = useQueryClient();
  const client = useHttpClient();

  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Ghostbusters.headquartersDetail, slug],
    queryFn: async () => {
      return await client.get(`/gb/api/headquarters/${slug}`) as Headquarters;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      deleteModalHandlers.close();
      return await client.delete(`/gb/api/headquarters/${slug}`)
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        message: t('delete.success'),
        position: 'top-right'
      })
      queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Ghostbusters.headquartersList]})
      queryClient.removeQueries({queryKey: [ReactQueryKeys.Ghostbusters.headquartersDetail]})
      router.back();
    },
    onError: () => {
      notifications.show({
        color: 'red',
        message: t('delete.error'),
        position: 'top-right'
      })
    }
  })
  
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure();

  return <>
    <Loader visible={isFetching && !data} />
    {data && <Box pos={"relative"}>
      <LoadingOverlay visible={isFetching || deleteMutation.isPending} />
      {menu && menu.checkPermission('ghostbusters', 'delete') && data.canChange && <Group justify={"end"}>
          <Button leftSection={<TbTrash />} onClick={deleteModalHandlers.open}>
            {t('delete.button')}
          </Button>
        <DeleteModal opened={deleteModalOpened} resourceName={data.name} close={deleteModalHandlers.close} onConfirm={() => {
          deleteMutation.mutate(slug)
        }}/>
      </Group>}
      <PaperCard>
        {menu && (!menu.checkPermission('ghostbusters', 'update') || !data.canChange) && <Group>
          <Stack>
            <Text fw={"bold"}>{t('name')}:</Text>
            <Text fw={"bold"}>{t('description')}:</Text>
            <Text fw={"bold"}>{t('cost')}:</Text>
            <Text fw={"bold"}>{t('containmentGridCapacity')}:</Text>
            <Text fw={"bold"}>{t('inventorySize')}:</Text>
            <Text fw={"bold"}>{t('garageSize')}:</Text>
          </Stack>
          <Stack>
            <Text>{data.name}</Text>
            <Text>{data.description}</Text>
            <Text>${data.cost.toFixed(2)}</Text>
            <Text>{data.containmentGridCapacity}</Text>
            <Text>{data.inventorySize} {t('units', {count: data.inventorySize})}</Text>
            <Text>{data.garageSize}</Text>
          </Stack>
        </Group>}
        {menu && menu.checkPermission('ghostbusters', 'update') && data.canChange && <HeadquartersForm 
          onSubmit={(newData?: Headquarters) => {
            if (newData != null) {
              if (newData.slug != data.slug) {
                router.replace(`/gb/headquarters/${newData.slug}`)
              } else {
                queryClient.setQueryData([ReactQueryKeys.Ghostbusters.headquartersDetail, slug], newData)
              }
            }
          }} 
          initialData={data} 
        />}
      </PaperCard>
    </Box>}
  </>
}