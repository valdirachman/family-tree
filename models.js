"use strict";

class Person {

  constructor(repo, {id, name, gender, birthDate, fatherId, motherId}) {
    this.repo = repo;
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.birthDate = birthDate;
    this.fatherId = fatherId;
    this.motherId = motherId;
  }

  getId() {
    // returns id
    return this.id;
  }

  isMale() {
    // returns boolean
    if (this.gender === "male") {
      return true;
    } else {
      return false;
    }
  }

  getName() {
    return this.name;
  }

  getBirthDate() {
    return this.birthDate;
  }

  getFatherId() {
    return this.fatherId;
  }

  getMotherId() {
    return this.motherId;
  }

  getFather() {
    return this.repo.getPersonById(this.fatherId);
  }

  getMother() {
    return this.repo.getPersonById(this.motherId);
  }

  isMarried() {
    let hashMarriage = this.repo.getHashMarriage();
    // If this person is male
    if (this.isMale()){
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getHusbandId() === this.id) {
          // If marriage is not ended
          if (!marriage.isEnded()) {
            return true;
          }
        }
      }
    // If this person is female
    } else {
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getWifeId() === this.id) {
          // If marriage is not ended
          if (!marriage.isEnded()) {
            return true;
          }
        }
      }
    }

    // If this person is NOT married
    return false;
  }

  isDivorced() {
    let hashMarriage = this.repo.getHashMarriage();
    let divorced = false;
    // If this person is male
    if (this.isMale()){
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getHusbandId() === this.id) {
          // If marriage is not ended
          if (!marriage.isEnded()) {
            return false;
          } else {
            divorced = true;
          }
        }
      }
    // If this person is female
    } else {
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getWifeId() === this.id) {
          // If marriage is not ended
          if (!marriage.isEnded()) {
            return false;
          } else {
            divorced = true;
          }
        }
      }
    }

    // if this person has ended the last marriage, return true; otherwise he/she has not married yet and return false
    return divorced;
  }

  isParent(child) {
    return (this.id === child.getFatherId() || this.id === child.getMotherId());
  }

  isStepParent(child) {
    // If this person is the parent of the child, return false;
    if (this.isParent(child)) {
      return false;
    }

    let hashMarriage = this.repo.getHashMarriage();
    if (this.isMale()) {
      // cek apakah this person merupakan spouse dari biological mother nya child yang baru
      let biologicalMotherId = child.getMotherId();
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        // if marriage is associated with the biological mother and marriage is not ended and the husband is not the child's father
        if (marriage.getWifeId() === biologicalMotherId && !marriage.isEnded()){
          return marriage.getHusbandId() === this.id;
        }
      }
    } else {
      // cek apakah this person merupakan spouse dari biological father nya child yang baru
      let biologicalFatherId = child.getFatherId();
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        // if marriage is associated with the biological father and marriage is not ended
        if (marriage.getHusbandId() === biologicalFatherId && !marriage.isEnded()){
          return marriage.getWifeId() === this.id;
        }
      }
    }

    return false;
  }

  getSpouse() {
    let hashMarriage = this.repo.getHashMarriage();
    // If this person is male
    if (this.isMale()){
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getHusbandId() === this.id) {
          // If marriage is not ended
          if (!marriage.isEnded()) {
            return marriage.getWife();
          }
        }
      }
    // If this person is female
    } else {
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getWifeId() === this.id) {
          // If marriage is not ended
          if (!marriage.isEnded()) {
            return marriage.getHusband();
          }
        }
      }
    }

    // If this person doesn't have spouse
    return null;
  }

  getFormerSpouses() {
    let hashMarriage = this.repo.getHashMarriage();
    let arrFormerSpouses = [];
    // If this person is male
    if (this.isMale()){
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getHusbandId() === this.id) {
          // If marriage is not ended
          if (marriage.isEnded()) {
            arrFormerSpouses.push(marriage.getWife());
          }
        }
      }
    // If this person is female
    } else {
      for (let marriageId in hashMarriage) {
        let marriage = hashMarriage[marriageId];
        if (marriage.getWifeId() === this.id) {
          // If marriage is not ended
          if (marriage.isEnded()) {
            arrFormerSpouses.push(marriage.getHusband());
          }
        }
      }
    }

    return arrFormerSpouses;
  }

  getParents() {
    let biologicalFather = this.getFather();
    let biologicalMother = this.getMother();
    let arrParents = [];
    arrParents.push(biologicalFather);
    arrParents.push(biologicalMother);
    return arrParents;
  }

  getChildren() {
    let hashPerson = this.repo.getHashPerson();
    let arrChildren = [];
    // if this person is male
    if (this.isMale()){
      for (let personId in hashPerson) {
        let person = hashPerson[personId];
        if (person.getFatherId() === this.id) {
          arrChildren.push(person);
        }
      }
    // if this person is female
    } else {
      for (let personId in hashPerson) {
        let person = hashPerson[personId];
        if (person.getMotherId() === this.id) {
          arrChildren.push(person);
        }
      }
    }
    return arrChildren;
  }

  getSiblings() {
    let hashPerson = this.repo.getHashPerson();
    let arrSiblings = [];
    for (let personId in hashPerson) {
      if (personId === this.id) continue;
      let person = hashPerson[personId];
      if (person.getFatherId() === this.getFatherId() || person.getMotherId() === this.getMotherId()) {
        arrSiblings.push(person);
      }
    }
    return arrSiblings;
  }

  getSisters() {
    let hashPerson = this.repo.getHashPerson();
    let arrSisters = [];
    for (let personId in hashPerson) {
      if (personId === this.id) continue;
      let person = hashPerson[personId];
      if (!person.isMale() && (person.getFatherId() === this.getFatherId() || person.getMotherId() === this.getMotherId())) {
        arrSisters.push(person);
      }
    }
    return arrSisters;
  }

  getBrothers() {
    let hashPerson = this.repo.getHashPerson();
    let arrBrothers = [];
    for (let personId in hashPerson) {
      if (personId === this.id) continue;
      let person = hashPerson[personId];
      if (person.isMale() && (person.getFatherId() === this.getFatherId() || person.getMotherId() === this.getMotherId())) {
        arrBrothers.push(person);
      }
    }
    return arrBrothers;
  }

  getBiologicalSiblings() {
    let hashPerson = this.repo.getHashPerson();
    let arrSiblings = [];
    for (let personId in hashPerson) {
      if (personId === this.id) continue;
      let person = hashPerson[personId];
      if (person.getFatherId() === this.getFatherId() && person.getMotherId() === this.getMotherId()) {
        arrSiblings.push(person);
      }
    }
    return arrSiblings;
  }

  getBiologicalSisters() {
    let hashPerson = this.repo.getHashPerson();
    let arrSisters = [];
    for (let personId in hashPerson) {
      if (personId === this.id) continue;
      let person = hashPerson[personId];
      if (!person.isMale() && (person.getFatherId() === this.getFatherId() && person.getMotherId() === this.getMotherId())) {
        arrSisters.push(person);
      }
    }
    return arrSisters;
  }

  getBiologicalBrothers() {
    let hashPerson = this.repo.getHashPerson();
    let arrBrothers = [];
    for (let personId in hashPerson) {
      if (personId === this.id) continue;
      let person = hashPerson[personId];
      if (person.isMale() && (person.getFatherId() === this.getFatherId() && person.getMotherId() === this.getMotherId())) {
        arrBrothers.push(person);
      }
    }
    return arrBrothers;
  }

  getStepChildren() {
    let spouse = this.getSpouse();
    if (spouse) {
      let arrChildren = spouse.getChildren();
      if (arrChildren.length > 0 && !this.isParent(arrChildren[0])) {
        return arrChildren;
      }
    }
    return [];
  }

  getStepMother() {
    let father = this.getFather();
    if (father) {
      let fatherSpouse = father.getSpouse();
      if (fatherSpouse && !fatherSpouse.isParent(this)) {
        return fatherSpouse;
      }
    }
    return null;
  }

  getStepFather() {
    let mother = this.getMother();
    if (mother) {
      let motherSpouse = mother.getSpouse();
      if (motherSpouse && !motherSpouse.isParent(this)) {
        return motherSpouse;
      }
    }
    return null;
  }

  getDaughters() {
    let hashPerson = this.repo.getHashPerson();
    let arrDaughters = [];
    for (let personId in hashPerson) {
      let person = hashPerson[personId];
      if (!person.isMale() && this.isParent(person)) {
        arrDaughters.push(person);
      }
    }
    return arrDaughters;
  }

  getSons() {
    let hashPerson = this.repo.getHashPerson();
    let arrSons = [];
    for (let personId in hashPerson) {
      let person = hashPerson[personId];
      if (person.isMale() && this.isParent(person)) {
        arrSons.push(person);
      }
    }
    return arrSons;
  }

  getStepSisters() {
    let arrStepSisters = []
    let stepMother = this.getStepMother();
    if (stepMother) {
      let arrStepSistersFromStepMother = stepMother.getDaughters();
      if (arrStepSistersFromStepMother.length > 0) {
        arrStepSisters = arrStepSisters.concat(arrStepSistersFromStepMother);
      }
    }
    let stepFather = this.getStepFather();
    if (stepFather) {
      let arrStepSistersFromStepFather = stepFather.getDaughters();
      if (arrStepSistersFromStepFather.length > 0) {
        arrStepSisters = arrStepSisters.concat(arrStepSistersFromStepFather);
      }
    }
    return arrStepSisters;
  }

  getStepBrothers() {
    let arrStepBrothers = []
    let stepMother = this.getStepMother();
    if (stepMother) {
      let arrStepBrothersFromStepMother = stepMother.getSons();
      if (arrStepBrothersFromStepMother.length > 0) {
        arrStepBrothers = arrStepBrothers.concat(arrStepBrothersFromStepMother);
      }
    }
    let stepFather = this.getStepFather();
    if (stepFather) {
      let arrStepBrothersFromStepFather = stepFather.getSons();
      if (arrStepBrothersFromStepFather.length > 0) {
        arrStepBrothers = arrStepBrothers.concat(arrStepBrothersFromStepFather);
      }
    }
    return arrStepBrothers;
  }

  getUncles() {
    let arrUncles = [];
    // Get uncles from biological father
    let biologicalFather = this.getFather();
    if (biologicalFather) {
      arrUncles = arrUncles.concat(biologicalFather.getBiologicalBrothers());
    }
    // Get uncles from biological mother
    let biologicalMother = this.getMother();
    if (biologicalMother) {
      arrUncles = arrUncles.concat(biologicalMother.getBiologicalBrothers());
    }
    return arrUncles;
  }

  getAunties() {
    let arrAunties = [];
    // Get aunties from biologicalFather
    let biologicalFather = this.getFather();
    if (biologicalFather) {
      arrAunties = arrAunties.concat(biologicalFather.getBiologicalSisters());
    }
    // Get aunties from biological mother
    let biologicalMother = this.getMother();
    if (biologicalMother) {
      arrAunties = arrAunties.concat(biologicalMother.getBiologicalSisters());
    }
    return arrAunties;
  }

  getGrandFathers() {
    let arrGrandFathers = [];
    let father = this.getFather();
    if (father) {
      let grandFatherFromFather = father.getFather();
      if (grandFatherFromFather) {
          arrGrandFathers.push(grandFatherFromFather);
      }
    }
    let mother = this.getMother();
    if (mother) {
      let grandFatherFromMother = mother.getFather();
      if (grandFatherFromMother) {
          arrGrandFathers.push(grandFatherFromMother);
      }
    }
    return arrGrandFathers;
  }

  getGrandMothers() {
    let arrGrandMothers = [];
    let father = this.getFather();
    if (father) {
      let grandMotherFromFather = father.getMother();
      if (grandMotherFromFather) {
          arrGrandMothers.push(grandMotherFromFather);
      }
    }
    let mother = this.getMother();
    if (mother) {
      let grandMotherFromMother = mother.getMother();
      if (grandMotherFromMother) {
          arrGrandMothers.push(grandMotherFromMother);
      }
    }
    return arrGrandMothers;
  }

  getGrandParents() {
    let arrGrandFathers = this.getGrandFathers();
    let arrGrandMothers = this.getGrandMothers();
    let arrGrandParents = arrGrandFathers.concat(arrGrandMothers);
    return arrGrandParents;
  }

  getGrandChildren() {
    let arrGrandChildren = [];
    let arrChildren  = this.getChildren();
    if (arrChildren.length > 0) {
      for (let child of arrChildren) {
        let arrGrandChildrenFromChild = child.getChildren();
        if (arrGrandChildrenFromChild.length > 0) {
            arrGrandChildren = arrGrandChildren.concat(arrGrandChildrenFromChild);
        }
      }
    }
    return arrGrandChildren;
  }

  getCousins() {
    let arrCousins = [];
    // Get cousins from uncles
    let arrUncles = this.getUncles();
    if (arrUncles.length > 0) {
      for (let uncle of arrUncles) {
        let arrCousinsFromUncle = uncle.getChildren();
        if (arrCousinsFromUncle.length > 0) {
          arrCousins = arrCousins.concat(arrCousinsFromUncle);
        }
      }
    }
    // Get cousins from aunties
    let arrAunties = this.getAunties();
    if (arrAunties.length > 0) {
      for (let aunty of arrAunties) {
        let arrCousinsFromAunty = aunty.getChildren();
        if (arrCousinsFromAunty.length > 0) {
          arrCousins = arrCousins.concat(arrCousinsFromAunty);
        }
      }
    }
    return arrCousins;
  }

  getNephews() {
    // Get biological siblings, then get the children
    let arrSiblings = this.getBiologicalSiblings();
    let arrNephews = []
    if (arrSiblings.length > 0) {
      for (let sibling of arrSiblings) {
        let arrChildrenFromSibling = sibling.getChildren();
        if (arrChildrenFromSibling.length > 0) {
          arrNephews = arrNephews.concat(arrChildrenFromSibling);
        }
      }
    }
    return arrNephews;
  }

  hashToNumericArray(hashResult) {
    let numericArray = [];
    for (let item in hashResult){
        numericArray.push(hash_array[item]);
    }
    return numericArray;
  }

  findRec(arrString, hashResult) {
    if (arrString.length === 0) {
      hashResult[this.id] = this;
      return hashResult;
    }
    let last = arrString.pop();
    switch (last) {
      case "spouse":
        let spouse = this.getSpouse();
        if (spouse) {
          hashResult = spouse.findRec(arrString, hashResult);
        }
        break;
      case "former spouse":
        let formerSpouses = this.getFormerSpouses();
        for (let formerSpouse of formerSpouses) {
          hashResult = formerSpouse.findRec(arrString, hashResult);
        }
        break;
      case "parent":
        let parents = this.getParents();
        for (let parent of parents) {
          hashResult = parent.findRec(arrString, hashResult);
        }
        break;
      case "child":
        let children = this.getChildren();
        for (let child of children) {
          hashResult = child.findRec(arrString, hashResult);
        }
        break;
      case "sibling":
        let siblings = this.getSiblings();
        for (let sibling of siblings) {
          hashResult = sibling.findRec(arrString, hashResult);
        }
        break;
      case "sister":
        let sisters = this.getSisters();
        for (let sister of sisters) {
          hashResult = sister.findRec(arrString, hashResult);
        }
        break;
      case "brother":
        let brothers = this.getBrothers();
        for (let brother of brothers) {
          hashResult = brother.findRec(arrString, hashResult);
        }
        break;
      case "step child":
        let stepChildren = this.getStepChildren();
        for (let stepChild of stepChildren) {
          hashResult = stepChild.findRec(arrString, hashResult);
        }
        break;
      case "step sister":
        let stepSisters = this.getStepSisters();
        for (let stepSister of stepSisters) {
          hashResult = stepSister.findRec(arrString, hashResult);
        }
        break;
      case "step brother":
        let stepBrothers = this.getStepBrothers();
        for (let stepBrother of stepBrothers) {
          hashResult = stepBrother.findRec(arrString, hashResult);
        }
        break;
      case "step mother":
        let stepMother = this.getStepMother();
        if (stepMother) {
          hashResult = stepMother.findRec(arrString, hashResult);
        }
        break;
      case "step father":
        let stepFather = this.getStepFather();
        if (stepFather) {
          hashResult = stepFather.findRec(arrString, hashResult);
        }
        break;
      case "uncle":
        let uncles = this.getUncles();
        for (let uncle of uncles) {
          hashResult = uncle.findRec(arrString, hashResult);
        }
        break;
      case "aunty":
        let aunties = this.getAunties();
        for (let aunty of aunties) {
          hashResult = aunty.findRec(arrString, hashResult);
        }
        break;
      case "grand father":
        let grandFathers = this.getGrandFathers();
        for (let grandFather of grandFathers) {
          hashResult = grandFather.findRec(arrString, hashResult);
        }
        break;
      case "grand mother":
        let grandMothers = this.getGrandMothers();
        for (let grandMother of grandMothers) {
          hashResult = grandMother.findRec(arrString, hashResult);
        }
        break;
      case "grand parent":
        let grandParents = this.getGrandParents();
        for (let grandParent of grandParents) {
          hashResult = grandParent.findRec(arrString, hashResult);
        }
        break;
      case "grand child":
        let grandChildren = this.getGrandChildren();
        for (let grandChild of grandChildren) {
          hashResult = grandChild.findRec(arrString, hashResult);
        }
        break;
      case "cousin":
        let cousins = this.getCousins();
        for (let cousin of cousins) {
          hashResult = cousin.findRec(arrString, hashResult);
        }
        break;
      case "nephew":
        let nephews = this.getNephews();
        for (let nephew of nephews) {
          hashResult = nephew.findRec(arrString, hashResult);
        }
        break;
      default:
        console.log("I could not recognize " + last + ", what is it?")
        return {};
    }
    return hashResult;
  }

  find(string) {
    let arrString = string.split(" of ");
    let hashResult = {};
    hashResult = findRec(arrString, hashResult);
    return hashToNumericArray(hashResult);
  }

  relationTo(person) {
    let queue = [];
    let arrPath = [];
    let hashVisited = {};
    queue.push([person, arrPath]);
    while (queue.length > 0) {
      let [node, arrPathRelation] = queue.shift();
      if (node.getId() === this.getId()){
        let stringRelation = arrPathRelation.join(" of ");
        return this.getName() + " is a " + stringRelation + " of "+ person.getName();
      }
      let arrRelations = [];
      let arrSingle = [];
      arrSingle.push([node.getSpouse(), "spouse"]);
      arrSingle.push([node.getStepMother(), "step mother"]);
      arrSingle.push([node.getStepFather(), "step father"]);
      arrRelations.push([node.getFormerSpouses(), "former spouse"]);
      arrRelations.push([node.getParents(), "parent"]);
      arrRelations.push([node.getChildren(), "child"]);
      arrRelations.push([node.getSiblings(), "sibling"]);
      arrRelations.push([node.getSisters(), "sister"]);
      arrRelations.push([node.getBrothers(), "brother"]);
      arrRelations.push([node.getStepChildren(), "step child"]);
      arrRelations.push([node.getStepSisters(), "step sister"]);
      arrRelations.push([node.getStepBrothers(), "step brother"]);
      arrRelations.push([node.getUncles(), "uncle"]);
      arrRelations.push([node.getAunties(), "aunty"]);
      arrRelations.push([node.getGrandFathers(), "grand father"]);
      arrRelations.push([node.getGrandMothers(), "grand mother"]);
      //grandParents = node.getGrandParents() -> this is not included since it's the same as grandfathers and grandmothers
      arrRelations.push([node.getGrandChildren(), "grand child"]);
      arrRelations.push([node.getCousins(), "cousin"]);
      arrRelations.push([node.getNephews(), "nephew"]);

      for (let [element, relationString] of arrSingle) {
        if (element && !(element.getId() in hashVisited)) {
          let newArrPath = arrPathRelation.slice();
          newArrPath.push(relationString);
          queue.push([element, newArrPath]);
          hashVisited[element.getId()] = true;
        }
      }

      for (let [arrRelation, relationString] of arrRelations) {
        for (let aPerson of arrRelation) {
          if (aPerson && !(aPerson.getId() in hashVisited)) {
            let newArrPath = arrPathRelation.slice();
            newArrPath.push(relationString);
            queue.push([aPerson, newArrPath]);
            hashVisited[aPerson.getId()] = true;
          }
        }
      }
    }

    // No relation
    return this.getName() + " is not related to " + person.getName();
  }
}

class Marriage {

  constructor(repo, {id, husbandId, wifeId, startDate, endDate}) {
    this.repo = repo;
    this.id = id;
    this.husbandId = husbandId;
    this.wifeId = wifeId;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  getId() {
    return this.id;
  }

  getHusbandId() {
    return this.husbandId;
  }

  getWifeId() {
    return this.wifeId;
  }

  getHusband() {
    return this.repo.getPersonById(this.husbandId);
  }

  getWife() {
    return this.repo.getPersonById(this.wifeId);
  }

  getMarriageDate() {
    return this.startDate;
  }

  getDivorceDate() {
    return this.endDate;
  }

  isEnded() {
    if (this.endDate){
      return true;
    } else {
      return false;
    }
  }
}

class Repo {

  constructor() {
    // Creates hash for Person and Marriage data
    this.hashPerson = {};
    this.hashMarriage = {};
  }

  getHashPerson() {
    return this.hashPerson;
  }

  getHashMarriage() {
    return this.hashMarriage;
  }

  addPerson({id, name, gender, birthDate, fatherId, motherId}) {
    this.hashPerson[id] = new Person(this, {id, name, gender, birthDate, fatherId, motherId});
  }

  addMarriage({id, husbandId, wifeId, startDate, endDate}) {
    this.hashMarriage[id] = new Marriage(this, {id, husbandId, wifeId, startDate, endDate});
  }

  getPersonById(id) {
    if (id in this.hashPerson) {
      return this.hashPerson[id];
    } else {
      return null;
    }
  }

  getMarriageById(id) {
    if (id in this.hashMarriage) {
      return this.hashMarriage[id];
    } else {
      return null;
    }
  }

  getAncestors(person) {
    let queue = [],
        hashAncestors = {};
    queue.push({person: person, distance: 0});
    while (queue.length > 0) {
      let node = queue.shift(),
          human = node.person,
          distance = node.distance,
          father = human.getFather(),
          mother = human.getMother();
      if (father) {
        queue.push({person: father, distance: distance + 1});
        hashAncestors[father.getId()] = {person: father, distance: distance + 1};
      }
      if (mother) {
        queue.push({person: mother, depth: depth + 1});
        hashAncestors[mother.getId()] = {person: mother, distance: distance + 1};
      }
    }
    return hashAncestors;
  }

  getRootAndDistance(person, hashAncestors){
    let queue = [];
    queue.push({person: person, distance: 0});
    while (queue.length > 0) {
      let node = queue.shift(),
          human = node.person,
          distance1 = node.distance,
          father = human.getFather(),
          mother = human.getMother();
      // If this person included in hashAncestors of the other person
      if (hashAncestors[human.getId()] !== undefined) {
        // Cek distance
        let distance2 = hashAncestors[human.getId()].distance;
        let distanceMax = (distance1 > distance2) ? distance1 : distance2;
        return {person: human, distance: distanceMax};
      }
      if (father) {
        queue.push({person: father, distance: distance1 + 1});
      }
      if (mother) {
        queue.push({person: mother, distance: distance1 + 1});
      }
    }
    return null;
  }

  getRelationRoot(person1, person2) {
    let hashAncestorsPerson1 = this.getAncestors(person1);
    return this.getRootAndDistance(person2, hashAncestorsPerson1);
  }
}

module.exports = {Person, Marriage, Repo};
