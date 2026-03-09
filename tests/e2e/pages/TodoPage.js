/**
 * Page Object Model for TODO Application
 * Encapsulates all interactions with the TODO app pages
 */
class TodoPage {
  constructor(page) {
    this.page = page;
    // Element selectors
    this.addTaskButton = 'button:has-text("Add Task")';
    this.titleInput = 'input[placeholder="What needs to be done?"]';
    this.descriptionInput = 'textarea[placeholder="Add more details..."]';
    this.dueDateInput = 'input[type="date"]';
    this.prioritySelect = '[role="combobox"]';
    this.saveButton = 'button:has-text("Save")';
    this.cancelButton = 'button:has-text("Cancel")';
    this.taskCard = '[role="button"]:has-text("Task")';
    this.completeCheckbox = 'input[type="checkbox"]';
    this.editButton = 'button[aria-label*="Edit"]';
    this.deleteButton = 'button[aria-label*="Delete"]';
    this.filterAll = 'button:has-text("All")';
    this.filterActive = 'button:has-text("Active")';
    this.filterCompleted = 'button:has-text("Completed")';
    this.sortButton = '[role="combobox"]';
    this.emptyState = 'text=No items found';
  }

  async goto() {
    await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    // Wait for the app to load
    await this.page.waitForTimeout(1000);
  }

  async addTask(title, description = '', dueDate = '', priority = 'medium') {
    // Click Add Task button
    await this.page.click('text=Add Task');
    await this.page.waitForTimeout(500);

    // Fill form fields
    await this.page.fill('input[placeholder="What needs to be done?"]', title);
    
    if (description) {
      await this.page.fill('textarea[placeholder="Add more details..."]', description);
    }

    if (dueDate) {
      const inputs = await this.page.$$('input[type="date"]');
      if (inputs.length > 0) {
        await inputs[0].fill(dueDate);
      }
    }

    if (priority && priority !== 'medium') {
      // Click priority select and choose option
      const selects = await this.page.$$('[role="combobox"]');
      if (selects.length > 0) {
        await selects[0].click();
        await this.page.click(`text=${priority}`);
      }
    }

    // Submit form
    await this.page.click('button:has-text("Save")');
    await this.page.waitForTimeout(500);
  }

  async completeTask(taskIndex = 0) {
    const checkboxes = await this.page.$$('input[type="checkbox"]');
    if (checkboxes.length > taskIndex) {
      await checkboxes[taskIndex].click();
      await this.page.waitForTimeout(300);
    }
  }

  async editTask(taskIndex, newData) {
    const editButtons = await this.page.$$('button[aria-label*="Edit"]');
    if (editButtons.length > taskIndex) {
      await editButtons[taskIndex].click();
      await this.page.waitForTimeout(500);

      if (newData.title) {
        await this.page.fill('input[placeholder="What needs to be done?"]', newData.title);
      }

      if (newData.description) {
        await this.page.fill('textarea[placeholder="Add more details..."]', newData.description);
      }

      await this.page.click('button:has-text("Save")');
      await this.page.waitForTimeout(500);
    }
  }

  async deleteTask(taskIndex = 0) {
    const deleteButtons = await this.page.$$('button[aria-label*="Delete"]');
    if (deleteButtons.length > taskIndex) {
      await deleteButtons[taskIndex].click();
      await this.page.waitForTimeout(500);
      
      // If there's a confirmation dialog, confirm the deletion
      const confirmButtons = await this.page.$$('button:has-text("Delete")');
      if (confirmButtons.length > 1) {
        await confirmButtons[confirmButtons.length - 1].click();
      }
      
      await this.page.waitForTimeout(300);
    }
  }

  async filterByStatus(status) {
    let buttonText = status.charAt(0).toUpperCase() + status.slice(1);
    if (status === 'active') buttonText = 'Active';
    if (status === 'completed') buttonText = 'Completed';
    if (status === 'all') buttonText = 'All';
    
    await this.page.click(`button:has-text("${buttonText}")`);
    await this.page.waitForTimeout(300);
  }

  async sortBy(criterion) {
    // Click sort dropdown
    const selects = await this.page.$$('[role="combobox"]');
    if (selects.length > 0) {
      const sortSelect = selects[selects.length - 1];
      await sortSelect.click();
      await this.page.waitForTimeout(300);
      
      // Select sort option
      let optionText = criterion;
      if (criterion === 'dueDate') optionText = 'By Due Date';
      if (criterion === 'status') optionText = 'By Status';
      if (criterion === 'createdAt') optionText = 'By Created Date';
      
      await this.page.click(`text=${optionText}`);
      await this.page.waitForTimeout(300);
    }
  }

  async getTaskCount() {
    const tasks = await this.page.$$('div[role="button"]:has-text("Edit")');
    return tasks.length;
  }

  async getTaskList() {
    const tasks = [];
    const taskElements = await this.page.locator('div[role="button"][aria-label*="task"]').all();
    
    for (const element of taskElements) {
      const title = await element.textContent();
      tasks.push(title);
    }
    
    return tasks;
  }

  async waitForTaskToAppear(taskTitle) {
    await this.page.waitForSelector(`text=${taskTitle}`, { timeout: 5000 });
  }

  async isTaskComplete(taskIndex = 0) {
    const checkboxes = await this.page.$$('input[type="checkbox"]');
    if (checkboxes.length > taskIndex) {
      return await checkboxes[taskIndex].isChecked();
    }
    return false;
  }

  async isEmptyStateShown() {
    const emptyState = await this.page.$('text=No items found');
    return emptyState !== null;
  }

  async setViewport(width, height) {
    await this.page.setViewportSize({ width, height });
    await this.page.waitForTimeout(300);
  }

  async getPageTitle() {
    return await this.page.title();
  }
}

module.exports = { TodoPage };
