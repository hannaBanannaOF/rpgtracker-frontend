import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ReactQueryKeys } from './enums';
import { useHttpClient } from './useHttpClient';

export function useMenu() {

  const client = useHttpClient();
  const queryClient = useQueryClient();

  const {data, isFetching } = useQuery({
    queryKey: [ReactQueryKeys.Core.userInfoMenu],
    queryFn: async () => {
      return await client.get("/core/api/permissions").then(json => {
        localStorage.setItem('user-info-rpgtracker', JSON.stringify(json));
        return json;
      }) as UserInfo;
    }
  });

  useEffect(() => {
    return () => {
      let storeddata = localStorage.getItem('user-info-rpgtracker');
      if (storeddata != null) {
        queryClient.setQueryData([ReactQueryKeys.Core.userInfoMenu], JSON.parse(storeddata))
      }
    }
  }, [])

  const getPermission = (screen: string, permission: string) => {
    return data && data.permissions && data.permissions.filter((val) => {
      return val.screen == screen && val.permission.filter((perm) => {
        return perm == permission
      }).length > 0
    }).length > 0
  }

  const menuProps = {
    data: data,
    loading: isFetching,
    checkPermission: getPermission
  }

  return menuProps;
}