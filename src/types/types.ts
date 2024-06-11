export type Employee = {
	firstName: string;
	lastName: string;
	id: number;
	rank: Rank;
	team: number;
	shifts: Shift[];
};

const ranks = {
	SeniorSergeant: "S/Sgt",
	Sergeant: "Sgt",
	BrevetSergeant: "B/Sgt",
	SeniorConstable: "S/C",
	Constable: "Cons"
} as const;

export type Rank = typeof ranks[keyof typeof ranks];

export type Shift = {
	date: Date,
	code: ShiftCode,
	comment: string
}

const shiftCode = {
	D: "D",
	LD: "D*",
	A: "A",
	LA: "A\'",
	N: "N",
	R: "RDO"
} as const;

export type ShiftCode = typeof shiftCode[keyof typeof shiftCode];
