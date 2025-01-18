'use client';

import { Box, Button, Flex, Grid, Loader, LoadingOverlay, Paper, Space, Text, Title } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useDisclosure } from "@mantine/hooks";
import { TbTrash } from "react-icons/tb";
import { useMenu } from "@/src/shared/useMenu";
import { DeleteModal } from "@/src/components/deletemodal/deletemodal";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

export const getEctoOne = async (slug: string) => {
  return await fetch(`/gb/api/ecto-one/${slug}`).then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  }).then(json => {
    return json;
  }) as EctoOne;
}

export const deleteEctoOne = async (slug: string) => {
  return await fetch(`/gb/api/ecto-one/${slug}`, {
    method: "DELETE"
  }).then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.ok;
  })
}

export function EctoOneDetails({ slug } : { slug: string }) {
  const t = useTranslations('ghostbusters.ecto_one.details');
  
  const menu = useMenu();

  const router = useRouter();
  const queryClient = useQueryClient();

  const {data, isFetching } = useQuery({
    queryKey: ['gb-ecto-one-details', slug],
    queryFn: () => getEctoOne(slug)
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEctoOne,
    onSuccess: (ok) => {
      deleteModalHandlers.close();
      if (ok) {
        notifications.show({
          color: 'green',
          message: t('delete.success'),
          position: 'top-right'
        })
        router.back();
        queryClient.invalidateQueries({queryKey: ['gb-ecto-one-list']})
      } else {
        notifications.show({
          color: 'red',
          message: t('delete.error'),
          position: 'top-right'
        })
      }
    }
  })
  
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure();

  return <>
    {menu.loading || (isFetching && !data) && <Flex mt="md" justify={"center"}>
      <Loader type="bars"/>  
    </Flex>}
    {data && <Box pos={"relative"}>
      <LoadingOverlay visible={deleteMutation.isPending} />
      {menu && menu.checkPermission('ghostbusters', 'delete') && <Flex justify={"end"}>
          <Button leftSection={<TbTrash />} onClick={deleteModalHandlers.open}>
            {t('delete.button')}
          </Button>
        <DeleteModal opened={deleteModalOpened} resourceName={data.name} close={deleteModalHandlers.close} onConfirm={() => {
          deleteMutation.mutate(slug)
        }}/>
      </Flex>}
      <Paper shadow="md" p="md" my="md" styles={{
        root: {
            backgroundColor: 'var(--mantine-color-default-hover)',
        }
      }}>
        <Grid>
          <Grid.Col>
            <Flex align={"center"}>
              <Title order={4}>{t('name')}:</Title>
              <Space w={"xs"} />
              {data.name}
            </Flex>
          </Grid.Col>
          <Grid.Col>
            <Flex align={"center"}>
              <Title order={4}>{t('carryWeight')}:</Title>
              <Space w={"xs"} />
              <Text>{data.carryWeight} {t('units', {count: data.carryWeight})}</Text>
            </Flex>
          </Grid.Col>
          <Grid.Col>
            <Flex align={'center'}>
              <Title order={4}>{t('seats')}:</Title>
              <Space w={"xs"} />
              {data.seats}
            </Flex>
          </Grid.Col>
          <Grid.Col>
            <Flex align={'center'}>
              <Title order={4}>{t('cost')}:</Title>
              <Space w={"xs"} />
              ${data.cost.toFixed(2)}
            </Flex>
          </Grid.Col>
        </Grid>
      </Paper>
    </Box>}
  </>
}