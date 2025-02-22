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
import { TalentTrait } from "../enum";
import { TalentForm } from "../form";
import { Talent } from "../types";

export function TalentDetails({ slug } : { slug: string }) {
  const t = useTranslations('ghostbusters.talents.details');
  const queryClient = useQueryClient();
  const router = useRouter();
  const menu = useMenu();
  const client = useHttpClient();
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure();

  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Ghostbusters.talentDetail, slug],
    queryFn: async () => {
      return await client.get(`http://localhost:8081/gb/api/talent/${slug}`) as Talent
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      deleteModalHandlers.close();
      return await client.delete(`http://localhost:8081/gb/api/talent/${slug}`)
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        message: t('delete.success'),
        position: 'top-right'
      })
      queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Ghostbusters.talentList]})
      queryClient.removeQueries({queryKey: [ReactQueryKeys.Ghostbusters.talentDetail]})
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

  return <>
    <Loader visible={isFetching && !data}/>
    {data && <Box pos={"relative"}>
      <LoadingOverlay visible={deleteMutation.isPending} />
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
            <Text fw={"bold"}>{t('trait')}:</Text>
          </Stack>
          <Stack>
            <Text>{data.name}</Text>
            <Text>{TalentTrait.getLabel(data.trait)}</Text>
          </Stack>
        </Group>}
        {menu && menu.checkPermission('ghostbusters', 'update') && data.canChange && <TalentForm 
          onSubmit={(newData?: Talent) => {
            if (newData != null) {
              if (newData.slug != data.slug) {
                router.replace(`/gb/talents/${newData.slug}`)
              } else {
                queryClient.setQueryData([ReactQueryKeys.Ghostbusters.talentDetail, slug], newData)
              }
            }
          }} 
          initialData={data} 
        />}
      </PaperCard>
    </Box>}
  </>
}