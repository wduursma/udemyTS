// project Type
enum ProjectStatus {Active, Finished}


class Project {

  constructor(
    public id:  string, 
    public title: string, 
    public description: string, 
    public people: number, 
    public status:  ProjectStatus
    ) {}
}

type Listener = (items: Project[]) => void;

// project Sate management 
class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {

  }

 static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }
  addlistner(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }
  addproject(title: string, description: string, numOfpeople: number) {
    const newproject =  new Project(
      Math.random().toString(), 
      title, 
      description, 
      numOfpeople, 
      ProjectStatus.Active
      );
    this.projects.push(newproject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState =  ProjectState.getInstance();

//validation 
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = validatableInput.value.length >= validatableInput.minLength;
  }
  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = validatableInput.value.length <= validatableInput.maxLength;
  }
  if (validatableInput.min != null && typeof validatableInput.value === 'number' ){
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (validatableInput.max != null && typeof validatableInput.value === 'number' ){
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}


//Binding
function autobind(
  _: any, 
  _2: string, 
  descriptor: PropertyDescriptor
){
  const originalmethod  = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalmethod.bind(this);
      return boundFn;
    }
  };
  return adjDescriptor; 
}
// component Base Class
class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string, 
    HostElementId: string, 
    insertAtStart: boolean,
    newElementId?: string
    ) 
    {
      this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
      this.hostElement = document.getElementById(HostElementId)! as T;
      const importedNode = document.importNode(this.templateElement.content, true);
      this.element = importedNode.firstElementChild as U;
      if (newElementId) {
        this.element.id = newElementId;
      }
      this.attach(insertAtStart);
    }
      private attach(insertAtBeginning: boolean) {
          this.hostElement.insertAdjacentElement(
            insertAtBeginning ? 'afterbegin' : 'beforeend',
            this.element 
          )
      } 
}

//projectList Class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProject: Project[];

  constructor(private type:  'active'| 'finished') {

    this.assignedProject = [];


    projectState.addlistner((projects: Project[]) => {
      const relevantprojects = projects.filter(prj => {
        if( this.type === 'active' ) {
          return prj.status === ProjectStatus.Active;
        }
          return prj.status === ProjectStatus.Finished;
      } );
      this.assignedProject = relevantprojects;
      this.renderprojects();
    });
    
    this.attach();
    this.renderContent();

  }
  private renderprojects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProject){
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }
  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }
  
  
}




// projectInput class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;

    this.configure();
    this.attach();

  }

  private  gatherUserImput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true
    }
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    }
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5
    }
    if(
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable) 

      ) {
        alert('foutje');
        return; 
      } else {
        return  [enteredTitle, enteredDescription, +enteredPeople]
      }
  }
  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = ''; 
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserImput();
    if (Array.isArray(userInput)){
      const [title, desc, people] = userInput;
      projectState.addproject(title, desc, people)
      console.log(title, desc, people);
      this.clearInputs();

    }
  }

  private  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }
  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element )
  }
} 

const prjImput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finshedPrjList = new ProjectList('finished');
