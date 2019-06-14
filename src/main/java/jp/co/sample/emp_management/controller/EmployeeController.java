package jp.co.sample.emp_management.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import jp.co.sample.emp_management.domain.Employee;
import jp.co.sample.emp_management.form.RegistrationEmployeeForm;
import jp.co.sample.emp_management.form.SearchEmployeeForm;
import jp.co.sample.emp_management.form.UpdateEmployeeForm;
import jp.co.sample.emp_management.service.EmployeeService;

/**
 * 従業員情報を操作するコントローラー.
 * 
 * @author igamasayuki
 *
 */
@Controller
@RequestMapping("/employee")
public class EmployeeController {

	@Autowired
	private EmployeeService employeeService;

	/**
	 * 使用するフォームオブジェクトをリクエストスコープに格納する.
	 * 
	 * @return フォーム
	 */
	@ModelAttribute
	public UpdateEmployeeForm setUpForm() {
		return new UpdateEmployeeForm();
	}

	/**
	 * 使用するフォームオブジェクトをリクエストスコープに格納する.
	 * 
	 * @return フォーム
	 */
	@ModelAttribute
	public SearchEmployeeForm setUpSearchEmployeeForm() {
		return new SearchEmployeeForm();
	}

	/**
	 * 使用するフォームオブジェクトをリクエストスコープに格納する.
	 * 
	 * @return フォーム
	 */
	@ModelAttribute
	public RegistrationEmployeeForm setUpegistrationEmployeeForm() {
		return new RegistrationEmployeeForm();
	}

	/////////////////////////////////////////////////////
	// ユースケース：従業員一覧を表示する
	/////////////////////////////////////////////////////
	/**
	 * 従業員一覧画面を出力します.
	 * 
	 * @param model モデル
	 * @return 従業員一覧画面
	 */
	@RequestMapping("/showList")
	public String showList(Model model, SearchEmployeeForm form) {
		List<Employee> employeeList = employeeService.findByName(form.getName());
		
		if (form.getName() == null || form.getName().length() == 0 || employeeList.size() == 0) {	
				employeeList = employeeService.showList();
				model.addAttribute("employeeList", employeeList);
		}
	
		model.addAttribute("employeeList", employeeList);
		
		List<Employee> employees = employeeService.showList();
		List<String> employeeNames = new ArrayList<>();
		for (Employee employee : employees) {
			employeeNames.add(employee.getName());
		}
		model.addAttribute("employeeNames", employeeNames);
		
		return "employee/list";
	}

	/////////////////////////////////////////////////////
	// ユースケース：従業員詳細を表示する
	/////////////////////////////////////////////////////
	/**
	 * 従業員詳細画面を出力します.
	 * 
	 * @param id    リクエストパラメータで送られてくる従業員ID
	 * @param model モデル
	 * @return 従業員詳細画面
	 */
	@RequestMapping("/showDetail")
	public String showDetail(String id, Model model) {
		Employee employee = employeeService.showDetail(Integer.parseInt(id));
		model.addAttribute("employee", employee);
		return "employee/detail";
	}

	/////////////////////////////////////////////////////
	// ユースケース：従業員詳細を更新する
	/////////////////////////////////////////////////////
	/**
	 * 従業員詳細(ここでは扶養人数のみ)を更新します.
	 * 
	 * @param form 従業員情報用フォーム
	 * @return 従業員一覧画面へリダクレクト
	 */
	@RequestMapping("/update")
	public String update(@Validated UpdateEmployeeForm form, BindingResult result, Model model) {
		if (result.hasErrors()) {
			return showDetail(form.getId(), model);
		}
		Employee employee = new Employee();
		employee.setId(form.getIntId());
		employee.setDependentsCount(form.getIntDependentsCount());
		employeeService.update(employee);
		return "redirect:/employee/showList";
	}

	/**
	 * 従業員登録フォームに遷移する.
	 * 
	 * @return 従業員登録画面
	 */
	@RequestMapping("/toRegist")
	public String toRegist() {
		return "employee/register";
	}

	/**
	 * 従業員登録を行う.
	 * 
	 * @param form フォーム
	 * @return 従業員リスト
	 */
	@RequestMapping("/register")
	public String register(RegistrationEmployeeForm form) {
		Employee employee = new Employee();
		String imageName = form.getImage().getOriginalFilename();
		String filePath = "src/main/resources/static/img/" + imageName;
		
		try {
			File uploadFile =new File(filePath);
			byte[] bytes = form.getImage().getBytes();
            BufferedOutputStream uploadFileStream = new BufferedOutputStream(new FileOutputStream(uploadFile));
            uploadFileStream.write(bytes);
            uploadFileStream.close();
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		BeanUtils.copyProperties(form, employee);
		employee.setImage(imageName);
		employeeService.insert(employee);
		
		return "redirect:/employee/showList";
	}
}