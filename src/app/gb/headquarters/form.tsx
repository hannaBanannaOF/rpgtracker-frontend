import { ReactQueryKeys } from "@/src/shared/enums";
import { useHttpClient } from "@/src/shared/useHttpClient";
import { Box, Button, Flex, Group, LoadingOverlay, NumberInput, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import * as Yup from 'yup';

export function HeadquartersForm({ onSubmit, initialData }: { onSubmit: (newData?: Headquarters) => void, initialData?: Headquarters }) {

  const client = useHttpClient();
  const t = useTranslations("ghostbusters.headquarters.form");
  const queryClient = useQueryClient();

  const saveHeadquartersMutation = useMutation({
    mutationFn: async ({ data }: { data: Headquarters }) => {
      let promise = initialData != null ? client.put(`/gb/api/headquarters/${initialData.slug!}`, data) : client.post('/gb/api/headquarters', data)
      return await promise as Headquarters | undefined
    },
    onSuccess: (data) => {
      notifications.show({
        color: 'green',
        message: t('notifications.success'),
        position: 'top-right'
      })
      queryClient.invalidateQueries({queryKey: [ReactQueryKeys.Ghostbusters.headquartersList]})
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
    inventorySize: Yup.number().typeError(t('inventorySize.must_be_number')).required(t('inventorySize.required')).min(1, t('inventorySize.min_value')),
    containmentGridCapacity: Yup.number().typeError(t('containmentGridCapacity.must_be_number')).required(t('containmentGridCapacity.required')).min(0, t('containmentGridCapacity.min_value')),
    garageSize: Yup.number().typeError(t('garageSize.must_be_number')).required(t('garageSize.required')).min(1, t('garageSize.min_value')),
  });

  const form = useForm({
    mode: 'controlled',
    initialValues: initialData ?? {
      name: "",
      description: "",
      cost: 0.00,
      inventorySize: 0,
      containmentGridCapacity: 0,
      garageSize: 0
    },
    validate: yupResolver(schema)
  })

  return <Box pos={"relative"}>
    <LoadingOverlay visible={saveHeadquartersMutation.isPending} />
    <form onSubmit={
      form.onSubmit(values => {
        return saveHeadquartersMutation.mutate({data: values});
      })
    }>
      <Stack>
        <TextInput label={t('name.label')} key={form.key('name')} {...form.getInputProps('name')} />
        <Flex gap={"md"} direction={{ base: "column", sm: "row" }}>
          <NumberInput style={{ flexGrow: 1 }} label={t('cost.label')} prefix="$ " decimalScale={2} fixedDecimalScale key={form.key('cost')} {...form.getInputProps('cost')} />
          <NumberInput style={{ flexGrow: 1 }} label={t('containmentGridCapacity.label')} key={form.key('containmentGridCapacity')} {...form.getInputProps('containmentGridCapacity')} />
        </Flex>
        <Flex gap={"md"} direction={{ base: "column", sm: "row" }}>
          <NumberInput style={{ flexGrow: 1 }} label={t('inventorySize.label')} suffix={' '+t('inventorySize.units', {count: form.getValues().inventorySize})} key={form.key('inventorySize')} {...form.getInputProps('inventorySize')} />
          <NumberInput style={{ flexGrow: 1 }} label={t('garageSize.label')} key={form.key('garageSize')} {...form.getInputProps('garageSize')} />
        </Flex>
        <Textarea label={t('description.label')} key={form.key('description')} {...form.getInputProps('description')} />
        <Group justify="flex-end" mt="md">
          <Button type={"submit"}>{t('submit')}</Button>
        </Group>
      </Stack>
    </form>
  </Box>
}