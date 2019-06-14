package jp.co.sample.emp_management.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import jp.co.sample.emp_management.domain.Employee;
import jp.co.sample.emp_management.service.EmployeeService;

@RestController
@RequestMapping("/employee")
public class AjaxResponceController {

	@Autowired
	private EmployeeService employeeService;

	@RequestMapping(value = "/employee-names", method = RequestMethod.GET)
	public Map<String, List<String>> getName() {
		List<String> employeeNames = new ArrayList<>();
		List<Employee> employees = employeeService.showList();

		for (Employee employee : employees) {
			employeeNames.add(employee.getName());
		}
		
		Map<String, List<String>> employeeNameMap = new HashMap<>();
		System.out.println("employeeNames:" + employeeNames);
		employeeNameMap.put("names", employeeNames);
		return employeeNameMap;
	}

}
