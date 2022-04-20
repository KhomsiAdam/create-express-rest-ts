export enum IssueType {
  TASK = 'task',
  BUG = 'bug',
}

export enum IssueStatus {
  BACKLOG = 'backlog',
  SELECTED = 'selected',
  INPROGRESS = 'inprogress',
  DONE = 'done',
}

export enum IssuePriority {
  HIGHEST = '5',
  HIGH = '4',
  MEDIUM = '3',
  LOW = '2',
  LOWEST = '1',
}

export enum SuccessMessages {
  ISSUE_CREATED = 'Issue created successfully.',
  ISSUE_UPDATED = 'Issue updated successfully.',
  ISSUE_DELETED = 'Issue deleted successfully.',
}

export enum ErrorMessages {
  ISSUES_NOT_FOUND = 'No issues found.',
  ISSUE_NOT_FOUND = 'Issue was not found.',
}
