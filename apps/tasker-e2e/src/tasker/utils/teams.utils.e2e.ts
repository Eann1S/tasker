import { CreateTeamDto, generateCreateTeamDto, TaskDto, TeamDto } from '@tasker/shared';
import axios from 'axios';
import { createRandomUser } from './auth.utils.e2e';

export async function createTeam(dto: CreateTeamDto, token: string) {
  return axios.post<TeamDto>('/teams', dto, getHeaders(token));
}

export async function createRandomTeam() {
  const { user, accessToken } = await createRandomUser();
  const dto = generateCreateTeamDto();
  const { data: team } = await createTeam(dto, accessToken);
  return { user, team, accessToken };
}

export async function getTeam(teamId: string, token: string) {
  return axios.get<TeamDto>(`/teams/${teamId}`, getHeaders(token));
}

export async function getTeams(token: string) {
  return axios.get<TeamDto[]>(`/teams`, getHeaders(token));
}

export async function addUserToTeam(
  teamId: string,
  userId: string,
  token: string
) {
  return axios.post<TeamDto>(
    `/teams/${teamId}/user/${userId}`,
    {},
    getHeaders(token)
  );
}

export async function removeUserFromTeam(
  teamId: string,
  userId: string,
  token: string
) {
  return axios.delete<TeamDto>(
    `/teams/${teamId}/user/${userId}`,
    getHeaders(token)
  );
}

export async function assignTaskToMember(
  teamId: string,
  taskId: string,
  memberId: string,
  token: string
) {
  return axios.post<TeamDto>(
    `/teams/${teamId}/member/${memberId}/task/${taskId}`,
    {},
    getHeaders(token)
  );
}

export async function removeTaskFromMember(
  teamId: string,
  taskId: string,
  memberId: string,
  token: string
) {
  return axios.delete<TeamDto>(
    `/teams/${teamId}/member/${memberId}/task/${taskId}`,
    getHeaders(token)
  );
}

export async function getTasksForMember(teamId: string, memberId: string, token: string) {
  return axios.get<TaskDto[]>(`/teams/${teamId}/member/${memberId}/tasks`, getHeaders(token));
}

export async function getTasksForTeam(teamId: string, token: string) {
  return axios.get<TaskDto[]>(`/teams/${teamId}/tasks`, getHeaders(token));
}

function getHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}
