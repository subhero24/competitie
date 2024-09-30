import Routes from 'react-sprout';

import { Redirect, searchToObject } from 'react-sprout';

import Error from './routes/error.jsx';
import Home from './routes/home.jsx';
import Team, { fetchTeam } from './routes/team.jsx';
import Club, { fetchClub } from './routes/club.jsx';
import Clubs, { fetchClubs } from './routes/clubs.jsx';
import Match, { fetchMatch } from './routes/match.jsx';
import Player, { fetchPlayer } from './routes/player.jsx';
import Players, { fetchPlayers } from './routes/players.jsx';
import PlayerResults from './routes/player/results.jsx';
import PlayerMatches from './routes/player/matches.jsx';
import Province, { fetchProvinceClubs } from './routes/province.jsx';
import ClubInfo from './routes/club/info.jsx';
import ClubTeams, { fetchClubTeams } from './routes/club/teams.jsx';
import ClubPlayers, { fetchClubPlayers } from './routes/club/players.jsx';
import ClubMatches, { fetchClubMatches } from './routes/club/matches.jsx';
import TeamRanking, { fetchTeamRanking } from './routes/team/ranking.jsx';
import TeamMatches, { fetchTeamMatches } from './routes/team/matches.jsx';
import Division from './routes/division.jsx';
import DivisionRanking, { fetchDivisionRanking } from './routes/division/ranking.jsx';
import DivisionMatches, { fetchDivisionMatches } from './routes/division/matches.jsx';
import Divisions, { fetchDivisions } from './routes/divisions.jsx';
import DivisionsCategory from './routes/divisions/category.jsx';
import DivisionsIndex from './routes/divisions/index.jsx';
import DivisionsRegional from './routes/divisions/regional.jsx';
import DivisionsProvincial from './routes/divisions/provincial.jsx';
import Favorites from './routes/favorites.jsx';

export default Routes(
	<Error>
		<Home>
			<Clubs path="clubs" data={fetchClubs} />
			<Players path="players" data={fetchPlayers} />
			<Divisions path="divisions" data={fetchDivisions}>
				<DivisionsIndex path="." />
				<DivisionsCategory path="*/" />
				<DivisionsRegional path="regional/" />
				<DivisionsProvincial path="provincial/" />
			</Divisions>

			<Club path="clubs/:clubId" data={fetchClub}>
				<ClubInfo path="info" />
				<ClubTeams path="teams" data={fetchClubTeams} />
				<ClubPlayers path="players" data={fetchClubPlayers} />
				<ClubMatches path="matches" data={fetchClubMatches} />
				<Redirect path="." to="info" />
			</Club>
			<Division path="divisions/:divisionId">
				<DivisionRanking path="ranking" data={fetchDivisionRanking} />
				<DivisionMatches path="matches" data={fetchDivisionMatches} />
				<Redirect path="." to="matches" />
			</Division>
			<Team path="clubs/:clubId/teams/:divisionId/:teamLetter" data={fetchTeam}>
				<TeamMatches path="matches" data={fetchTeamMatches} />
				<TeamRanking path="ranking" data={fetchTeamRanking} />
				<Redirect path="." to="matches" />
			</Team>
			<Match path="matches/*" data={fetchMatch} />
			<Player path="players/:playerId" data={fetchPlayer}>
				<PlayerResults path="results" />
				<PlayerMatches path="matches" />
			</Player>
			<Province path="provinces/:provinceUrl/clubs" data={fetchProvinceClubs} />

			<Favorites path="favorites" />

			<Redirect path="/" to="clubs" />
			<Redirect path="players/:playerId" to="players/:playerId/results" />
		</Home>
	</Error>,
	{
		search: searchToObject,
	},
);
