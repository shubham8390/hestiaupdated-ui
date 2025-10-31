import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Tier = {
  label: string;            // e.g., "Preferred return"
  note?: string;            // e.g., "8%"
  lpShare: number;          // 0–100
  gpShare: number;          // 0–100
};

type Stakeholder = {
  name: string;
  type: 'Individual' | 'Bank' | 'Public Institute' | 'Fund' | 'Legal';
  stakePct: number;         // 0–100
  rank: number;             // smaller rank exits first
};

@Component({
  selector: 'app-distribution-waterfall',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './distribution-waterfall.component.html',
  styleUrl: './distribution-waterfall.component.css'
})
export class DistributionWaterfallComponent {
 // Dummy data for the waterfall tiers (LP vs GP split at each step)
  tiers: Tier[] = [
    { label: 'Return of capital', note: 'pari passu', lpShare: 90, gpShare: 10 },
    { label: 'Preferred return',  note: '8%',         lpShare: 85, gpShare: 15 },
    { label: 'Catchup',           note: '10%',        lpShare: 80, gpShare: 20 },
    { label: 'Carried',           note: '13%',        lpShare: 70, gpShare: 30 },
    { label: 'Final distribution',note: 'over 13%',   lpShare: 60, gpShare: 40 }
  ];

  // Dummy stakeholder table
  stakeholders: Stakeholder[] = [
    { name: 'Investor A', type: 'Individual',       stakePct: 30, rank: 1 },
    { name: 'Bank B',     type: 'Bank',             stakePct: 25, rank: 2 },
    { name: 'Public Fund C', type: 'Public Institute', stakePct: 20, rank: 3 },
    { name: 'Growth Fund D', type: 'Fund',          stakePct: 15, rank: 4 },
    { name: 'SPV Legal E',   type: 'Legal',         stakePct: 10, rank: 5 },
  ];

  // helpers
  lpWidth(t: Tier) { return `${t.lpShare}%`; }
  gpWidth(t: Tier) { return `${t.gpShare}%`; }

  // sorted by exit priority (lower rank first)
  get sortedStakeholders(): Stakeholder[] {
    return [...this.stakeholders].sort((a, b) => a.rank - b.rank);
  }
}
