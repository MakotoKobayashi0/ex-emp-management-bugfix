package jp.co.sample.emp_management.domain;

import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;

/**
 * ログインしている管理者の情報を表すドメイン.
 * 
 * @author Makoto
 *
 */
public class LoginAdministrator extends User {

	private static final long serialVersionUID = 1L;
	/* 管理者 **/
	private Administrator admin;

	public LoginAdministrator(Administrator admin) {
		super(admin.getMailAddress(), admin.getPassword(), AuthorityUtils.createAuthorityList("ROLE_USER"));
		this.admin = admin;
	}

	public Administrator getAdmin() {
		return admin;
	}

	public void setAdmin(Administrator admin) {
		this.admin = admin;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
