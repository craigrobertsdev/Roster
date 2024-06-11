import type { Config } from "unique-names-generator";
import { uniqueNamesGenerator, names } from "unique-names-generator";
import type { Employee, Rank, Shift, ShiftCode } from "../types/types";

const config: Config = {
	dictionaries: [names]
}

export function generateDummyData(numEmp: number) {
	const employees: Employee[] = [];
	const date = new Date();
	for (let i = 0; i < numEmp; i++) {
		const id = Math.floor(Math.random() * 99999);
		const rank: Rank = generateRank(id);
		const team = Math.floor(Math.random() * 5);
		const firstName = uniqueNamesGenerator(config);
		const lastName = uniqueNamesGenerator(config);
		const emp: Employee = {
			firstName: uniqueNamesGenerator(config),
			lastName: uniqueNamesGenerator(config),
			id,
			rank,
			team,
			shifts: generateShifts(team)
		}

		employees.push(emp);
	}

	return employees;
}

function generateRank(id: number): Rank {
	switch (true) {
		case id < 20000: return "Cons"
		case id < 40000: return "S/C"
		case id < 60000: return "B/Sgt"
		case id < 80000: return "Sgt"
		case id < 100000: return "S/Sgt"
		default: return "Cons"
	}
}

function generateShifts(offset: number) {
	const shifts: Shift[] = [];
	const date = new Date();
	let shiftPos = 0 + (offset * 7);
	for (let i = 0; i < 365; i++) {
		shifts.push({
			code: shiftPattern[shiftPos],
			date: addDays(date, i)
			} as Shift)

		shiftPos++;
		if (shiftPos == 35) {
			shiftPos = 0;
		}
	}

	return shifts;
}

const shiftPattern: ShiftCode[] = [
	"D", "D", "D", "A", "A", "A", "A", "RDO", "RDO",
	"D*", "D", "D", "D", "D", "D*", "RDO", "RDO", "RDO", "RDO",
	"N", "N", "N", "N", "N", "N", "N", "RDO", "RDO",
	"A", "A", "A", "D*", "D*", "RDO", "RDO"
]; 

export function addDays(date: Date, days: number) {
	let result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}
