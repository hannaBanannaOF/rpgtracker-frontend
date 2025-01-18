import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useMenu() {

  const getUserInfo = async () => {
    return await fetch(`/core/api/permissions`).then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      }
      return response.json();
    }).then(json => {
      localStorage.setItem('user-info-rpgtracker', JSON.stringify(json));
      return json;
    }) as UserInfo;
  }

  const queryClient = useQueryClient();

  const {data, isFetching } = useQuery({
    queryKey: ['user-info-menu'],
    queryFn: getUserInfo
  });

  useEffect(() => {
    return () => {
      let storeddata = localStorage.getItem('user-info-rpgtracker');
      if (storeddata != null) {
        queryClient.setQueryData(['user-info-menu'], JSON.parse(storeddata))
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