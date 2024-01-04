export enum Gender {
  NONE = 0,
  MALE = 1,
  FEMALE = 2,
  OTHER = 3
}

export const GenderDisplay = {
  [Gender.NONE]: 'genderNone',
  [Gender.MALE]: 'genderMale',
  [Gender.FEMALE]: 'genderFemale',
  [Gender.OTHER]: 'genderOther'
}

export enum PointType {
  RECIEVED = 0,
  USED = 1
}
