'use client';

import { Box, Divider, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { Calendar } from "./calendar";
import { NextSession } from "./nextsession";

export function Home() {

  const [loading, setLoading] = useState(false);

  return <Box pos="relative">
    <LoadingOverlay visible={loading} />
    <NextSession setLoadingHomeAction={setLoading} />
    <Divider my="md"/>
    <Calendar setLoadingHomeAction={setLoading} />
  </Box>;
}