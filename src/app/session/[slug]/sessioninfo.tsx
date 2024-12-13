'use client';

import { BaseCharacterSheetInfo } from '@/src/app/character-sheet/[id]/baseinfo';
import { Flex, Loader, Title, Divider, SegmentedControl } from '@mantine/core';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from 'react';

type SessionCharacterSheet = {
    id: string;
    description: string;
}

type SessionDetail = {
    slug: string;
    sessionName: string;
    characterSheets: SessionCharacterSheet[]
};

const getSessionDetail = async (slug: string) => {
    return await fetch(`/core/api/sessions/${slug}`).then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      }
      return response.json();
    }).then(json => {
      return json;
    }) as SessionDetail;
  }

export function SessionInfo({slug} : {slug: string}) {

    const queryClient = useQueryClient();

    const [selectedSheet, setSelectedSheet] = useState(
      ''
    );
    
    const {data, isFetching } = useQuery({
        queryKey: ['session-detail', slug],
        queryFn: () => getSessionDetail(slug).then(data => {
            if (data.characterSheets.length > 0) {
              setSelectedSheet(data.characterSheets[0].id);
            }
            return data;
        }),
      });

    return <>
        {isFetching && !data && <Flex mt="md" justify={"center"}>
            <Loader type="bars"/>  
        </Flex>}
        {data && <>
            <Flex justify={'center'} my="md"><Title order={2}>{data.sessionName}</Title></Flex>
            <Divider />
            {data.characterSheets.length > 0 && <>
              <SegmentedControl my={'md'} fullWidth color={'rpgtracker-teal'} data={data.characterSheets.map((s) => { return {value: s.id, label: s.description}})} onChange={(val) => {
                  setSelectedSheet(val);
                  queryClient.refetchQueries({queryKey: ['character-sheet-info-basic'], exact: true, type: 'all'})
              }}/>
              <BaseCharacterSheetInfo slug={selectedSheet} />
            </>}
        </>}
    </>
}