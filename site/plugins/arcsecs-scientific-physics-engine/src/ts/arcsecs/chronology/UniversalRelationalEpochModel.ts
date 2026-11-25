export interface UniversalRelationalEpochInput {
    readonly acceptedStateTransitionCount: number;
    readonly relationalDistanceMatrix: ReadonlyArray<number>;
    readonly entropyProxy: number;
    readonly complexityProxy: number;
    readonly gravityWaveArrivalOrdinals: ReadonlyArray<number>;
    readonly photonArrivalOrdinals: ReadonlyArray<number>;
    readonly previousSnapshot?: UniversalRelationalEpochSnapshot;
}

export interface UniversalRelationalEpochSnapshot {
    readonly epochIndex: number;
    readonly stateTransitionCount: number;
    readonly relationalConfigurationHash: string;
    readonly totalRelationalChange: number;
    readonly meanRelationalChange: number;
    readonly entropyGradient: number;
    readonly complexityGradient: number;
    readonly gravityWaveEventOrderIndex: number;
    readonly photonLagOrderIndex: number;
    readonly normalizedChronologyScalar: number;
    readonly localClockFreeConfidence: number;
}

/** Builds a clockless universal ordering signal from relational state change, complexity growth, entropy drift, and gravity-wave event ordering. */
export class UniversalRelationalEpochModel {
    /**
     * Advances the Universal Relational Epoch without using light propagation or local atomic clock oscillation.
     * @param input Relational state, entropy, complexity, and messenger-order measurements for the next accepted state.
     */
    public advance(input: UniversalRelationalEpochInput): UniversalRelationalEpochSnapshot {
        const previousSnapshot: UniversalRelationalEpochSnapshot | undefined = input.previousSnapshot;
        const epochIndex: number = previousSnapshot === undefined ? 0 : previousSnapshot.epochIndex + 1;
        const stateTransitionCount: number = Math.max(0, Math.floor(this.finite(input.acceptedStateTransitionCount)));
        const relationalConfigurationHash: string = this.createRelationalConfigurationHash(input.relationalDistanceMatrix);
        const totalRelationalChange: number = this.calculateTotalRelationalChange(input.relationalDistanceMatrix, previousSnapshot);
        const meanRelationalChange: number = input.relationalDistanceMatrix.length === 0 ? 0 : totalRelationalChange / input.relationalDistanceMatrix.length;
        const entropyGradient: number = this.calculateGradient(input.entropyProxy, previousSnapshot === undefined ? input.entropyProxy : previousSnapshot.entropyGradient + input.entropyProxy - previousSnapshot.entropyGradient);
        const complexityGradient: number = this.calculateGradient(input.complexityProxy, previousSnapshot === undefined ? input.complexityProxy : previousSnapshot.complexityGradient + input.complexityProxy - previousSnapshot.complexityGradient);
        const gravityWaveEventOrderIndex: number = this.calculateOrdinalIndex(input.gravityWaveArrivalOrdinals);
        const photonLagOrderIndex: number = this.calculatePhotonLagIndex(input.gravityWaveArrivalOrdinals, input.photonArrivalOrdinals);
        const normalizedChronologyScalar: number = this.calculateChronologyScalar(stateTransitionCount, meanRelationalChange, entropyGradient, complexityGradient, gravityWaveEventOrderIndex);
        const localClockFreeConfidence: number = this.calculateClockFreeConfidence(input.gravityWaveArrivalOrdinals.length, input.photonArrivalOrdinals.length, photonLagOrderIndex);

        return {
            epochIndex,
            stateTransitionCount,
            relationalConfigurationHash,
            totalRelationalChange,
            meanRelationalChange,
            entropyGradient,
            complexityGradient,
            gravityWaveEventOrderIndex,
            photonLagOrderIndex,
            normalizedChronologyScalar,
            localClockFreeConfidence
        };
    }

    /**
     * Creates a first epoch from a known relational state.
     * @param input Initial relational state and messenger-order measurements.
     */
    public createInitialSnapshot(input: UniversalRelationalEpochInput): UniversalRelationalEpochSnapshot {
        return this.advance({
            acceptedStateTransitionCount: input.acceptedStateTransitionCount,
            relationalDistanceMatrix: input.relationalDistanceMatrix,
            entropyProxy: input.entropyProxy,
            complexityProxy: input.complexityProxy,
            gravityWaveArrivalOrdinals: input.gravityWaveArrivalOrdinals,
            photonArrivalOrdinals: input.photonArrivalOrdinals
        });
    }

    /**
     * Converts a relational epoch into a concise label suitable for telemetry panels.
     * @param snapshot Snapshot to format for a clockless telemetry display.
     */
    public formatEpochLabel(snapshot: UniversalRelationalEpochSnapshot): string {
        return `URE-${this.leftPad(snapshot.epochIndex.toString(), 6, "0")} / ${snapshot.relationalConfigurationHash}`;
    }

    private calculateTotalRelationalChange(currentMatrix: ReadonlyArray<number>, previousSnapshot: UniversalRelationalEpochSnapshot | undefined): number {
        if (previousSnapshot === undefined) {
            let initialTotal: number = 0;
            for (let index: number = 0; index < currentMatrix.length; index += 1) {
                initialTotal += Math.abs(this.finite(currentMatrix[index]));
            }
            return initialTotal;
        }

        const previousSeed: number = this.hashToUnitInterval(previousSnapshot.relationalConfigurationHash);
        let totalChange: number = 0;
        for (let index: number = 0; index < currentMatrix.length; index += 1) {
            const referenceValue: number = previousSeed * (index + 1);
            totalChange += Math.abs(this.finite(currentMatrix[index]) - referenceValue);
        }
        return totalChange;
    }

    private calculateGradient(currentValue: number, previousValue: number): number {
        return this.finite(currentValue) - this.finite(previousValue);
    }

    private calculateOrdinalIndex(ordinals: ReadonlyArray<number>): number {
        if (ordinals.length === 0) {
            return 0;
        }

        let weightedTotal: number = 0;
        let normalizer: number = 0;
        for (let index: number = 0; index < ordinals.length; index += 1) {
            const weight: number = index + 1;
            weightedTotal += this.finite(ordinals[index]) * weight;
            normalizer += weight;
        }
        return normalizer === 0 ? 0 : weightedTotal / normalizer;
    }

    private calculatePhotonLagIndex(gravityWaveArrivalOrdinals: ReadonlyArray<number>, photonArrivalOrdinals: ReadonlyArray<number>): number {
        const count: number = Math.min(gravityWaveArrivalOrdinals.length, photonArrivalOrdinals.length);
        if (count === 0) {
            return 0;
        }

        let totalLag: number = 0;
        for (let index: number = 0; index < count; index += 1) {
            totalLag += Math.max(0, this.finite(photonArrivalOrdinals[index]) - this.finite(gravityWaveArrivalOrdinals[index]));
        }
        return totalLag / count;
    }

    private calculateChronologyScalar(stateTransitionCount: number, meanRelationalChange: number, entropyGradient: number, complexityGradient: number, gravityWaveEventOrderIndex: number): number {
        const transitionTerm: number = Math.log(1 + Math.max(0, stateTransitionCount));
        const relationTerm: number = Math.log(1 + Math.max(0, meanRelationalChange));
        const entropyTerm: number = Math.max(0, entropyGradient);
        const complexityTerm: number = Math.max(0, complexityGradient);
        const gravityOrderTerm: number = Math.log(1 + Math.max(0, gravityWaveEventOrderIndex));
        return transitionTerm + relationTerm + entropyTerm + complexityTerm + gravityOrderTerm;
    }

    private calculateClockFreeConfidence(gravityCount: number, photonCount: number, photonLagOrderIndex: number): number {
        const gravityCoverage: number = this.clamp(gravityCount / Math.max(1, gravityCount + photonCount), 0, 1);
        const lagPenalty: number = this.clamp(photonLagOrderIndex / 1000, 0, 0.35);
        return this.clamp(0.65 + gravityCoverage - lagPenalty, 0, 1);
    }

    private createRelationalConfigurationHash(values: ReadonlyArray<number>): string {
        let hash: number = 2166136261;
        for (let index: number = 0; index < values.length; index += 1) {
            const roundedValue: string = this.finite(values[index]).toFixed(6);
            for (let characterIndex: number = 0; characterIndex < roundedValue.length; characterIndex += 1) {
                hash ^= roundedValue.charCodeAt(characterIndex);
                hash = Math.imul(hash, 16777619) >>> 0;
            }
        }
        return `rel-${this.leftPad(hash.toString(16), 8, "0")}`;
    }

    private leftPad(value: string, targetLength: number, paddingCharacter: string): string {
        let paddedValue: string = value;
        while (paddedValue.length < targetLength) {
            paddedValue = paddingCharacter + paddedValue;
        }
        return paddedValue;
    }

    private hashToUnitInterval(hashText: string): number {
        let hash: number = 0;
        for (let index: number = 0; index < hashText.length; index += 1) {
            hash = ((hash << 5) - hash + hashText.charCodeAt(index)) | 0;
        }
        return Math.abs(hash % 1000000) / 1000000;
    }

    private finite(value: number): number {
        return Number.isFinite(value) ? value : 0;
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}
