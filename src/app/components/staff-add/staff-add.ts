import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './staff-add.html',
  styleUrl: './staff-add.css'
})
export class StaffAdd implements OnInit {
  staffForm: FormGroup;
  selectedFile: File | null = null;
  isEditMode: boolean = false;
  employeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.staffForm = this.fb.group({
      empName: ['', [Validators.required, Validators.minLength(2)]],
      empAddress: ['', [Validators.required, Validators.minLength(5)]],
      empPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      empType: ['', Validators.required],
      dailyWage: [{ value: '', disabled: true }, [Validators.min(0)]],
      monthlySalary: [{ value: '', disabled: true }, [Validators.min(0)]],
      role: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;
    this.isEditMode = !!this.employeeId;

    if (this.isEditMode) {
      this.loadEmployee();
    }

    this.staffForm.get('empType')?.valueChanges.subscribe(value => {
      this.handleEmpTypeChange(value);
    });
  }

  loadEmployee(): void {
    if (this.employeeId) {
      this.employeeService.getEmployeeById(this.employeeId).subscribe({
        next: (employee) => {
          this.staffForm.patchValue({
            empName: employee.empName,
            empAddress: employee.empAddress,
            empPhone: employee.empPhone,
            empType: employee.empType,
            dailyWage: employee.dailyWage,
            monthlySalary: employee.monthlySalary,
            role: employee.role,
            username: employee.username,
            email: employee.email
          });
          this.handleEmpTypeChange(employee.empType);
          // Password is not fetched for security reasons
        },
        error: (error) => console.error('Error loading employee:', error)
      });
    }
  }

  handleEmpTypeChange(empType: string): void {
    const dailyWageControl = this.staffForm.get('dailyWage');
    const monthlySalaryControl = this.staffForm.get('monthlySalary');

    if (empType === 'DAILY') {
      dailyWageControl?.enable();
      dailyWageControl?.setValidators([Validators.required, Validators.min(0)]);
      monthlySalaryControl?.disable();
      monthlySalaryControl?.clearValidators();
      monthlySalaryControl?.setValue(null);
    } else if (empType === 'MONTHLY') {
      monthlySalaryControl?.enable();
      monthlySalaryControl?.setValidators([Validators.required, Validators.min(0)]);
      dailyWageControl?.disable();
      dailyWageControl?.clearValidators();
      dailyWageControl?.setValue(null);
    } else {
      dailyWageControl?.disable();
      monthlySalaryControl?.disable();
      dailyWageControl?.clearValidators();
      monthlySalaryControl?.clearValidators();
    }
    dailyWageControl?.updateValueAndValidity();
    monthlySalaryControl?.updateValueAndValidity();
  }

  triggerFileUpload(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only JPG, JPEG, or PNG files');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadPlaceholder = document.querySelector('.upload-placeholder') as HTMLElement;
        if (uploadPlaceholder && e.target?.result) {
          uploadPlaceholder.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.staffForm.valid) {
      const employee: Employee = this.staffForm.value;
      if (this.isEditMode && this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, employee).subscribe({
          next: () => {
            alert('Employee updated successfully!');
            this.router.navigate(['/staff']);
          },
          error: (error) => console.error('Error updating employee:', error)
        });
      } else {
        this.employeeService.createEmployee(employee).subscribe({
          next: () => {
            alert('Employee added successfully!');
            this.resetForm();
            this.router.navigate(['/staff']);
          },
          error: (error) => console.error('Error adding employee:', error)
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.staffForm.controls).forEach(key => {
      const control = this.staffForm.get(key);
      control?.markAsTouched();
    });
  }

  private resetForm(): void {
    this.staffForm.reset();
    this.selectedFile = null;
    const uploadPlaceholder = document.querySelector('.upload-placeholder') as HTMLElement;
    if (uploadPlaceholder) {
      uploadPlaceholder.innerHTML = `
        <i class="fas fa-camera"></i>
        <p>Upload photo</p>
      `;
    }
  }

  goBack(): void {
    this.router.navigate(['/staff']);
  }

  generateUsername(): void {
    const empName = this.staffForm.get('empName')?.value;
    if (empName) {
      const username = empName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
      this.staffForm.get('username')?.setValue(username);
    }
  }
}
