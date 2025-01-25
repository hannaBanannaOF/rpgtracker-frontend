'use client';

import { useHttpClient } from "@/src/shared/useHttpClient";
import { Box, Button, Combobox, Group, Input, InputBase, Loader, LoadingOverlay, Modal, useCombobox } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function AddUpgradeModal({ addUpgradeLink, queryKey, getAsyncDataAction }: { addUpgradeLink: string, queryKey: string[], getAsyncDataAction: () => Promise<any> }) {
  const [value, setValue] = useState<ListItem | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ListItem[]>([]);
  const [addUpgradeModalOpened, addUpgradeModalHandlers] = useDisclosure();
  const t = useTranslations("ghostbusters.add_upgrade")
  const queryClient = useQueryClient();
  const client = useHttpClient();

  const addUpgradeMutation = useMutation({
    mutationFn: async (data: ListItem) => {
      return await client.post(addUpgradeLink, { upgradeSlug: data.id });
    },
    onSuccess: () => {
      addUpgradeModalHandlers.close();
      notifications.show({
        color: 'green',
        message: t('success'),
        position: 'top-right'
      })
      queryClient.invalidateQueries({queryKey: queryKey})
    },
    onError: () => {
      notifications.show({
        color: 'red',
        message: t('error'),
        position: 'top-right'
      })
    }
  })

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => {
      if (data.length === 0 && !loading) {
        setLoading(true);
        getAsyncDataAction().then((response) => {
          setData(response);
          setLoading(false);
          combobox.resetSelectedOption();
        });
      }
    },
  });

  const options = data.map((item) => (
    <Combobox.Option value={item.id} key={item.id}>
      {item.description}
    </Combobox.Option>
  ));

  return (
    <Group justify="flex-end" mt="md">
        <Modal opened={addUpgradeModalOpened} onClose={addUpgradeModalHandlers.close} title={t('label')} centered>
            <Box pos={"relative"}>
                <LoadingOverlay visible={addUpgradeMutation.isPending} />
                <Combobox
                    store={combobox}
                    // withinPortal={false} 
                    onOptionSubmit={(val) => {
                        let ldata = data.filter((i) => {return i.id == val}).at(0)
                        setValue(ldata);
                        combobox.closeDropdown();
                    }}
                    >
                    <Combobox.Target>
                        <InputBase
                        component="button"
                        type="button"
                        pointer
                        rightSection={loading ? <Loader size={18} /> : <Combobox.Chevron />}
                        onClick={() => combobox.toggleDropdown()}
                        rightSectionPointerEvents="none"
                        >
                        {value?.description ?? <Input.Placeholder>{t('placeholder')}</Input.Placeholder>}
                        </InputBase>
                    </Combobox.Target>

                    <Combobox.Dropdown>
                        <Combobox.Options style={{ overflowY: 'auto' }}>
                        {loading ? <Combobox.Empty>{t('loading')}</Combobox.Empty> : options}
                        </Combobox.Options>
                    </Combobox.Dropdown>
                </Combobox>
                <Group justify="flex-end" mt="md">
                    <Button onClick={() => {
                        if (value) {
                            addUpgradeMutation.mutate(value);
                        }
                    }}>{t('save')}</Button>    
                </Group>
            </Box>
        </Modal>
        <Button onClick={addUpgradeModalHandlers.open}>{t('label')}</Button>
    </Group>
  );
}