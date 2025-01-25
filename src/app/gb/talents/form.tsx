import { ReactQueryKeys } from "@/src/shared/enums";
import { useHttpClient } from "@/src/shared/useHttpClient";
import { Box, Button, Group, LoadingOverlay, NativeSelect, Stack, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import * as Yup from 'yup';
import { TalentTrait } from "./enum";
import { Talent } from "./types";

export function TalentForm({ onSubmit, initialData }: { onSubmit: (newData?: Talent) => void, initialData?: Talent }) {

  const t = useTranslations("ghostbusters.talents.form");
  const queryClient = useQueryClient();
  const client = useHttpClient();

  const saveTalentMutation = useMutation({
    mutationFn: async ({ data }: { data: Talent }) => {
      let promise = initialData != null ? client.put(`/gb/api/talent/${initialData.slug!}`, data) : client.post(`/gb/api/talent`, data)
      return await promise as Talent | undefined
    },
    onSuccess: (data) => {
      notifications.show({
        color: 'green',
        message: t('notifications.success'),
        position: 'top-right'
      })
      queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Ghostbusters.talentList]})
      onSubmit(data);
    },
    onError: () => {
      notifications.show({
        color: 'red',
        message: t('notifications.error'),
        position: 'top-right'
      })
    }
  })

  const schema = Yup.object().shape({
    name: Yup.string().required(t('name.required')),
    trait: Yup.mixed().oneOf(Object.values(TalentTrait)).required(t('trait.required'))
  });

  const form = useForm({
    mode: 'controlled',
    initialValues: initialData ?? {
      name: "",
      trait: TalentTrait.brains
    },
    validate: yupResolver(schema)
  })

  return <Box pos={"relative"}>
    <LoadingOverlay visible={saveTalentMutation.isPending} />
    <form onSubmit={
      form.onSubmit(values => {
        return saveTalentMutation.mutate({data: values});
      })
    }>
      <Stack>
        <TextInput label={t('name.label')} key={form.key('name')} {...form.getInputProps('name')} />
        <NativeSelect label={t('trait.label')} key={form.key('trait')} data={TalentTrait.getSelectvalues()} {...form.getInputProps('trait')} />
        <Group justify="flex-end" mt="md">
          <Button type={"submit"}>{t('submit')}</Button>
        </Group>
      </Stack>
    </form>
  </Box>
}