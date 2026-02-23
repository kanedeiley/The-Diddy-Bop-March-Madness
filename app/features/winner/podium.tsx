"use client";
import { Podium1, Podium2, Podium3 } from '@/app/components/icons';
import { podiumWinners } from '.';

export default function PodiumWinners() {
    return (
        <div className="p-4 text-center">
            <h2 className="mb-6 text-xl md:text-2xl font-semibold">
                Winners
            </h2>
            <div className="flex justify-center items-end gap-2 md:gap-6 max-w-4xl mx-auto">
                {podiumWinners.map((w) => {
                    const isFirst = w.place === 1;
                    return (
                        <div
                            key={w.place}
                            className="flex flex-col items-center flex-1 max-w-[180px] md:max-w-[200px]"
                        >
                            {/* Winner info card */}
                            <div className="bg-gray-100 p-2 md:p-3 rounded-xl mb-2 md:mb-3 shadow-md w-full">
                                <div
                                    className={`
                                        ${isFirst ? 'w-20 h-20 md:w-24 md:h-24 border-2 md:border-3 border-yellow-400' : 'w-16 h-16 md:w-20 md:h-20 border-2 border-gray-300'}
                                        rounded-full overflow-hidden mx-auto mb-2
                                    `}
                                >
                                    <img
                                        src={w.imageUrl}
                                        alt={w.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="font-semibold text-sm md:text-base">{w.name}</div>
                                <div className="text-xs md:text-sm text-gray-600">
                                    Place: {w.place}
                                </div>
                                <div className="text-xs md:text-sm mt-1">
                                    Wins: <strong>{w.wins}</strong>
                                </div>
                                <div className="text-xs md:text-sm mt-1 truncate">
                                    Picked: <strong>{w.pickedChampion}</strong>
                                </div>
                            </div>

                            {/* Podium block */}
                            <div className="w-full">
                                {w.place === 2 ? (
                                    <Podium2 className="w-full h-auto " />
                                ) : w.place === 1 ? (
                                    <Podium1 className="w-full h-auto" />
                                ) : (
                                    <Podium3 className="w-full h-auto" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}