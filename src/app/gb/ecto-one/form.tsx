import { ReactQueryKeys } from "@/src/shared/enums";
import { useHttpClient } from "@/src/shared/useHttpClient";
import { Box, Button, Flex, Group, LoadingOverlay, NumberInput, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import * as Yup from 'yup';

export function EctoOneForm({ onSubmit, initialData }: { onSubmit: (newData?: EctoOne) => void, initialData?: EctoOne }) {

  const client = useHttpClient();
  const t = useTranslations("ghostbusters.ecto_one.form");
  const queryClient = useQueryClient();

  const saveEctoOneMutation = useMutation({
    mutationFn: async ({ data }: { data: EctoOne }) => {
      let promise = initialData != null ? client.put(`/gb/api/ecto-one/${initialData.slug!}`, data) : client.post('/gb/api/ecto-one', data)
      return await promise as EctoOne | undefined
    },
    onSuccess: (data) => {
      notifications.show({
        color: 'green',
        message: t('notifications.success'),
        position: 'top-right'
      })
      queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Ghostbusters.ectoOneList]})
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
    description: Yup.string().required(t('description.required')),
    cost: Yup.number().typeError(t('cost.must_be_number')).required(t('cost.required')).min(0.01, t('cost.min_value')),
    seats: Yup.number().typeError(t('seats.must_be_number')).required(t('seats.required')).min(1, t('seats.min_value')),
    carryWeight: Yup.number().typeError(t('carryWeight.must_be_number')).required(t('carryWeight.required')).min(1, t('carryWeight.min_value'))
  });

  const form = useForm({
    mode: 'controlled',
    initialValues: initialData ?? {
      name: "",
      description: "",
      cost: 0.00,
      carryWeight: 0,
      seats: 0
    },
    validate: yupResolver(schema)
  })

  return <Box pos={"relative"}>
    <LoadingOverlay visible={saveEctoOneMutation.isPending} />
    <form onSubmit={
      form.onSubmit(values => {
        return saveEctoOneMutation.mutate({data: values});
      })
    }>
      <Stack>
        <TextInput label={t('name.label')} key={form.key('name')} {...form.getInputProps('name')} />
        <Flex gap={"md"} direction={{ base: "column", sm: "row" }}>
          <NumberInput style={{ flexGrow: 1 }} label={t('cost.label')} prefix="$ " decimalScale={2} fixedDecimalScale key={form.key('cost')} {...form.getInputProps('cost')} />
          <NumberInput style={{ flexGrow: 1 }} label={t('seats.label')} key={form.key('seats')} {...form.getInputProps('seats')} />
          <NumberInput style={{ flexGrow: 1 }} label={t('carryWeight.label')} suffix={' '+t('carryWeight.units', {count: form.getValues().carryWeight})} key={form.key('carryWeight')} {...form.getInputProps('carryWeight')} />
        </Flex>
        <Textarea label={t('description.label')} key={form.key('description')} {...form.getInputProps('description')} />
        <Group justify="flex-end" mt="md">
          <Button type={"submit"}>{t('submit')}</Button>
        </Group>
      </Stack>
    </form>
  </Box>
}