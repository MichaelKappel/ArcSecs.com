export interface TerminologyViolation {
    readonly phrase: string;
    readonly index: number;
    readonly replacement: string;
}

export interface TerminologyGuardrailReport {
    readonly isClean: boolean;
    readonly violationCount: number;
    readonly violations: ReadonlyArray<TerminologyViolation>;
}

interface TerminologyRule {
    readonly phrase: string;
    readonly replacement: string;
}

/** Scans public ArcSecs copy for legacy terms that should not appear outside explicit comparison or rejected-concept sections. */
export class TerminologyGuardrail {
    private readonly rules: ReadonlyArray<TerminologyRule> = [
        { phrase: "spacetime curvature", replacement: "relational tether distortion" },
        { phrase: "fabric of spacetime", replacement: "relational state projection" },
        { phrase: "metric expansion", replacement: "optical propagation history" },
        { phrase: "warp bubble", replacement: "inertial decoupling field" },
        { phrase: "time dilation", replacement: "local clock/particle-rate distortion" },
        { phrase: "lightyear", replacement: "parsec, arcsecond geometry, or gravitational-wave distance" },
        { phrase: "speed of light is constant", replacement: "gravity-wave baseline with path-dependent electromagnetic propagation" },
        { phrase: "lensing-style visual effects", replacement: "relational optical aberration effects" }
    ];

    /**
     * Scans text for discouraged terms.
     * @param text Public-facing text to scan.
     * @param allowComparisonContext Allows matches when scanning a comparison/rebuttal page.
     */
    public scan(text: string, allowComparisonContext: boolean = false): TerminologyGuardrailReport {
        if (allowComparisonContext) {
            return { isClean: true, violationCount: 0, violations: [] };
        }

        const lowerText: string = text.toLowerCase();
        const violations: TerminologyViolation[] = [];
        for (let ruleIndex: number = 0; ruleIndex < this.rules.length; ruleIndex += 1) {
            const rule: TerminologyRule = this.rules[ruleIndex];
            let searchIndex: number = lowerText.indexOf(rule.phrase);
            while (searchIndex >= 0) {
                violations.push({ phrase: rule.phrase, index: searchIndex, replacement: rule.replacement });
                searchIndex = lowerText.indexOf(rule.phrase, searchIndex + rule.phrase.length);
            }
        }

        return {
            isClean: violations.length === 0,
            violationCount: violations.length,
            violations
        };
    }
}
