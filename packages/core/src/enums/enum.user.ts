export enum Gender {
  NONE = 0,
  MALE = 1,
  FEMALE = 2,
  OTHER = 3
}

export const GenderDisplay = {
  [Gender.NONE]: 'Chưa khác báo',
  [Gender.MALE]: 'Nam',
  [Gender.FEMALE]: 'Nữ',
  [Gender.OTHER]: 'Khác'
}