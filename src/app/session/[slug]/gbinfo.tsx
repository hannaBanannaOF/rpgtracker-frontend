import { Loader } from "@/src/components/loader/loader";
import { ReactQueryKeys } from "@/src/shared/enums";
import { useHttpClient } from "@/src/shared/useHttpClient";
import { ActionIcon, Box, Button, Group, LoadingOverlay, Modal, NumberInput, Stack, Title, Tooltip } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { TbPencil } from "react-icons/tb";
import * as yup from 'yup';

export function GbSessionInfo({slug, dmed, inPlay} : {slug: string, dmed: boolean, inPlay: boolean}) {
  
  const client = useHttpClient();
  const t = useTranslations('sessions.detail.gb');
  const [teamSavingsModalOpened, teamSavingsqModalHandlers] = useDisclosure();
  const queryClient = useQueryClient();

  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Ghostbusters.sessionInfo, slug],
    queryFn: async () => {
      return await client.get(`/gb/api/session/${slug}`) as GbSessionInfo;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({newValues}: {newValues: GbSessionInfo }) => {
      return await client.put(`/gb/api/session/${slug}`, newValues)
    },
    onSuccess: (data: GbSessionInfo) => {
      queryClient.setQueryData([ReactQueryKeys.Ghostbusters.sessionInfo, slug], data);
      notifications.show({
        color: 'green',
        message: t('team_savings.notifications.success'),
        position: 'top-right'
      })
    },
    onError() {
      notifications.show({
        color: 'red',
        message: t('team_savings.notifications.error'),
        position: 'top-right'
      })
    },
  })

  // const getLoadColor = (): string => {
  //   if (data == null) {
  //     return "primary"
  //   }
  //   let usage = (data.containmentGridLoad*100)/data.containmentGridCapacity;
  //   return usage < 75 ? "green" : (usage < 90 ? "yellow" : "red");
  // }

  return <>
    <Loader visible={isFetching && !data} />
    {data && <Box pos="relative">
      <LoadingOverlay visible={updateMutation.isPending || isFetching} />
      <Stack>
        <Group>
          <Title order={4}>{t('team_savings.label')}: ${data.teamSavings.toFixed(2)}</Title>
          {dmed && inPlay && <>
            <Tooltip label={t('team_savings.update')}>
              <ActionIcon onClick={teamSavingsqModalHandlers.open}>
                <TbPencil />
              </ActionIcon>
            </Tooltip>
            <TeamSavingsModal opened={teamSavingsModalOpened} close={teamSavingsqModalHandlers.close} updateMutation={updateMutation} initialData={data}/>
          </>}
        </Group>
        {/* {data.headquarters && <Stack align="center">
          <Title order={4}>{t('containment_grid.label')}</Title>
          <SemiCircleProgress
            fillDirection="left-to-right"
            orientation="up"
            filledSegmentColor={getLoadColor()}
            size={200}
            thickness={12}
            value={data.containmentGridCapacity > 0 ? (data.containmentGridLoad*100)/data.containmentGridCapacity : 0}
            label={`${(data.containmentGridCapacity > 0 ? (data.containmentGridLoad*100)/data.containmentGridCapacity : 0).toFixed(2)} %`}
            my={"sm"}
          />
          {dmed && inPlay && <>
            <Button onClick={containmentGridModalHandlers.open}>{t('containment_grid.update')}</Button>
            <ContainmentGridModal id={data.coreId} opened={containmentGridModalOpened} close={containmentGridModalHandlers.close} updateMutation={updateMutation} initialData={data}/>
          </>}
        </Stack>} */}
      </Stack>
    </Box>}
  </>;
}

function TeamSavingsModal({ opened, close, updateMutation, initialData }: { opened: boolean; close: () => void; updateMutation: UseMutationResult<GbSessionInfo, Error, { newValues: GbSessionInfo; }, unknown>; initialData: GbSessionInfo }) {
  const t = useTranslations('sessions.detail.gb.team_savings');

  const schema = yup.object().shape({
    teamSavings: yup.number().typeError(t('new_value.must_be_number')).min(0, t('new_value.min_value')).required(t('new_value.required'))
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: initialData,
    validate: yupResolver(schema)
  })

  return <Modal opened={opened} onClose={() => {
    form.reset();
    close();
  }} centered title={t('label')} size={"lg"}>
    <form onSubmit={
      form.onSubmit((values) => {
        close();
        updateMutation.mutate({newValues: values});
      })
    }>
      <Stack>
        <NumberInput label={t('new_value.label')} prefix="$ " decimalScale={2} fixedDecimalScale key={form.key('teamSavings')} {...form.getInputProps('teamSavings')} />
        <Group justify="flex-end" mt="md">
          <Button type={"submit"}>{t('new_value.submit')}</Button>
        </Group>
      </Stack>
    </form>
  </Modal>
}