export interface PopulateFeedback {
    finished: boolean;
    bets: any[];
}

let feedback: PopulateFeedbackCache | null = null;

export const getFeedbackInstance = () => {
    if (!feedback) {
        feedback = new PopulateFeedbackCache();
    }
    return feedback;
}

class PopulateFeedbackCache {
    finished: boolean = false;
    bets: any[] = [];

    constructor() {
        this.reset();
    }

    reset() {
        this.finished = false;
        this.bets = [];
    }
}