"use client";

import { useQuery } from "@tanstack/react-query";

import { coursesApi } from "../api";

export function useCourses() {
  return useQuery({ queryKey: ["courses"], queryFn: coursesApi.list });
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: ["courses", slug],
    queryFn: () => coursesApi.getBySlug(slug),
    enabled: Boolean(slug),
  });
}
