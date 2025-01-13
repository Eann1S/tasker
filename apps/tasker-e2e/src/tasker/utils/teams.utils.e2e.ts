import { CreateTeamDto, generateTeamData, TeamDto } from '@tasker/shared';
import axios from 'axios';
import { createRandomUser } from './auth.utils.e2e';

export async function createTeam(data: CreateTeamDto, token: string) {
  return axios.post<TeamDto>('/teams', data, getHeaders(token));
}

export async function createRandomTeam() {
  const { user, accessToken } = await createRandomUser();
  const data = generateTeamData();
  const { data: team } = await createTeam(data, accessToken);
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

export async function assignTaskToTeam(
  teamId: string,
  taskId: string,
  token: string
) {
  return axios.post<TeamDto>(
    `/teams/${teamId}/task/${taskId}`,
    {},
    getHeaders(token)
  );
}

export async function removeTaskFromTeam(
  teamId: string,
  taskId: string,
  token: string
) {
  return axios.delete<TeamDto>(
    `/teams/${teamId}/task/${taskId}`,
    getHeaders(token)
  );
}

function getHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}
