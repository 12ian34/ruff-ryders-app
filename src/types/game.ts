export type GameStatus = 'all' | 'complete' | 'in_progress' | 'not_started';

export interface HoleScore {
  holeNumber: number;
  strokeIndex: number;
  parScore: number;
  usaPlayerScore?: number;
  europePlayerScore?: number;
}

export interface Game {
  id: string;
  tournamentId: string;
  usaPlayerId: string;
  usaPlayerName: string;
  usaPlayerProfilePic?: string;
  europePlayerId: string;
  europePlayerName: string;
  europePlayerProfilePic?: string;
  handicapStrokes: number;
  higherHandicapTeam: 'USA' | 'EUROPE';
  holes: HoleScore[];
  strokePlayScore: {
    USA: number;
    EUROPE: number;
  };
  matchPlayScore: {
    USA: number;
    EUROPE: number;
  };
  isComplete: boolean;
  isStarted: boolean;
  startTime?: Date;
  endTime?: Date;
  playerIds: string[];
}